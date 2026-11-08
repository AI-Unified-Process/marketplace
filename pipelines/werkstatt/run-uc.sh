#!/usr/bin/env bash
#
# Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
# Part of the AI Unified Process — https://unifiedprocess.ai
# Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
#
# AI Unified Process Werkstatt - the stations for one use case.
#
#   G1 spec lint -> implement -> test -> [ build (G2-G4) -> audit (G5) -> fix ]* -> outcome
#
# Each agent station is its own headless Claude Code session, so the tester and the auditor never see the
# implementer's reasoning. Agents never run git; this script commits after each station. The outcome:
#
#   ready    all gates green; the status moves to Tested (Implemented when no coverage audit exists for the stack)
#   blocked  a blocking open question names the use case (the andon cord), or the spec lint fails;
#            only the new open questions stay, the code of this use case is dropped
#   stuck    the gates stay red after MAX_ROUNDS fix rounds or the cost budget is used up;
#            the code is dropped and kept as a diff in the run records
#
# Env: UC, ENGINE (marketplace checkout), MODEL, MAX_TURNS, MAX_ROUNDS, MAX_COST_USD, STACK_PLUGIN (empty for
#      layer plugins), DEFAULT_BRANCH, ARTIFACT_LOCATIONS, SPEC_LINT
# Writes .werkstatt/<UC>/summary.json and the records of every station.
set -uo pipefail

UC="${UC:?UC is required, e.g. UC-003}"
ENGINE="${ENGINE:?ENGINE is required}"
MODEL="${MODEL:-claude-sonnet-5}"
MAX_TURNS="${MAX_TURNS:-80}"
MAX_ROUNDS="${MAX_ROUNDS:-3}"
MAX_COST_USD="${MAX_COST_USD:-15}"
STACK_PLUGIN="${STACK_PLUGIN:-}"
DEFAULT_BRANCH="${DEFAULT_BRANCH:-main}"
ARTIFACT_LOCATIONS="${ARTIFACT_LOCATIONS:-}"
HELPER="$ENGINE/pipelines/werkstatt/werkstatt.py"
# Test code by path: Java/Kotlin test sources, test folders, TypeScript and .NET test files.
TEST_REGEX="${TEST_REGEX:-(^|/)(src/test|test|tests|e2e|__tests__)/|\\.(spec|test)\\.[cm]?[jt]sx?\$|Tests?\\.cs\$}"
OQ_FILE=docs/open_questions.md

F=".werkstatt/$UC"
mkdir -p "$F"
TOTAL_COST=0
ROUNDS=0
START_TIME=$(date +%s)
START_SHA=$(git rev-parse HEAD)

SPEC=$(python3 "$HELPER" spec "$UC") || { echo "::error::No specification for $UC"; exit 1; }

# The commands of the stack. Layer plugins: the orchestrators of aiup-core. A combined stack plugin brings its own.
if [ -z "$STACK_PLUGIN" ]; then
  IMPLEMENT="/aiup-core:use-case-implement $SPEC"
  TEST="/aiup-core:use-case-test $SPEC"
  AUDIT_AGENT="the uc-coverage-layered agent of aiup-core"
else
  IMPLEMENT="/$STACK_PLUGIN:implement $SPEC"
  TEST="Write the tests for the use case $SPEC with the test skills of the $STACK_PLUGIN plugin."
  if [ -f "$ENGINE/$STACK_PLUGIN/agents/uc-coverage.md" ]; then
    AUDIT_AGENT="the uc-coverage agent of $STACK_PLUGIN"
  else
    AUDIT_AGENT=""
  fi
fi

# The diff of the specification against the default branch makes removals visible (as in aiup-generate).
SPEC_DIFF=""
if git rev-parse -q --verify "origin/$DEFAULT_BRANCH" >/dev/null; then
  d=$(git diff "origin/$DEFAULT_BRANCH" HEAD -- "$SPEC")
  if [ -n "$d" ] && [ "${#d}" -le 20000 ]; then
    SPEC_DIFF="The specification was changed on this branch. Its diff against \`$DEFAULT_BRANCH\`:

~~~diff
$d
~~~

Reconcile the result with every change in this diff, not only with the current text. A removed line means the
behaviour it described was dropped deliberately: delete the code or tests that exist only for that behaviour."
  fi
fi

RULES="This run is part of the AI Unified Process Werkstatt: no person is present to answer questions.
When the specification has a gap or a contradiction that decides the result, do not guess: record it with
/aiup-core:open-questions in docs/open_questions.md with **Element:** $UC ..., **Blocking:** Yes, and stop.
Do not run git."

log() { echo "::group::$*"; }
endlog() { echo "::endgroup::"; }

# station <name> <prompt>
station() {
  local name="$1" prompt="$2" out="$F/session-$1-r$ROUNDS.json" t0 rc cost
  log "$UC: $name (round $ROUNDS)"
  t0=$(date +%s)
  claude -p "$prompt" \
    --model "$MODEL" \
    --max-turns "$MAX_TURNS" \
    --output-format json \
    --permission-mode bypassPermissions \
    --disallowedTools "Bash(git:*)" \
    > "$out" 2> "$F/session-$name-r$ROUNDS.err"
  rc=$?
  cost=$(jq -r '.total_cost_usd // 0' "$out" 2>/dev/null || echo 0)
  TOTAL_COST=$(awk -v a="$TOTAL_COST" -v b="${cost:-0}" 'BEGIN{printf "%.4f", a+b}')
  jq -cn --arg uc "$UC" --arg st "$name" --argjson round "$ROUNDS" --argjson rc "$rc" \
        --argjson cost "${cost:-0}" --argjson sec "$(( $(date +%s) - t0 ))" \
        '{uc:$uc, station:$st, round:$round, exit:$rc, cost_usd:$cost, seconds:$sec}' >> "$F/metrics.jsonl"
  echo "exit=$rc cost=$cost total=$TOTAL_COST"
  endlog
}

over_budget() { awk -v t="$TOTAL_COST" -v m="$MAX_COST_USD" 'BEGIN{exit !(t>m)}'; }

# Harness rule: a station may only change its own kind of file. Everything else is reverted.
#   guard tests  -> the implementer may not touch test code
#   guard code   -> the tester may only touch test code and the open questions
guard() {
  local mode="$1" file
  git add -A
  while IFS= read -r file; do
    [ -n "$file" ] || continue
    if [ "$mode" = tests ] && [[ "$file" =~ $TEST_REGEX ]]; then :
    elif [ "$mode" = code ] && ! [[ "$file" =~ $TEST_REGEX ]] && [ "$file" != "$OQ_FILE" ]; then :
    else continue
    fi
    echo "::warning::$UC: the $2 station changed $file; reverted."
    echo "$2 changed $file (reverted)" >> "$F/guard.log"
    git rm -q --cached -- "$file" 2>/dev/null || true
    if git cat-file -e "HEAD:$file" 2>/dev/null; then git checkout -q HEAD -- "$file"; else rm -f -- "$file"; fi
  done < <(git diff --cached --name-only HEAD)
  git reset -q
}

commit() {
  git add -A
  git diff --cached --quiet || git commit -qm "werkstatt($UC): $1"
}

blocking_questions() { python3 "$HELPER" blocking "$UC" | paste -sd, - | sed 's/,/, /g'; }

finish() {
  local outcome="$1" reason="$2" status=""
  case "$outcome" in
    blocked)
      # Only the open questions stay; the code of an unfinished use case is no proposal.
      git diff "$START_SHA" -- "$OQ_FILE" > "$F/oq.patch"
      git diff "$START_SHA" > "$F/dropped.diff"
      git reset -q --hard "$START_SHA"
      [ -s "$F/oq.patch" ] && git apply "$F/oq.patch" && commit "open questions" ;;
    stuck)
      git diff "$START_SHA" > "$F/dropped.diff"
      git reset -q --hard "$START_SHA" ;;
    ready)
      status=$(python3 "$HELPER" advance "$SPEC" "$3")
      commit "status $status" ;;
  esac
  jq -n --arg uc "$UC" --arg spec "$SPEC" --arg outcome "$outcome" --arg reason "$reason" --arg status "$status" \
        --argjson rounds "$ROUNDS" --argjson cost "$TOTAL_COST" --argjson sec "$(( $(date +%s) - START_TIME ))" \
        '{uc:$uc, spec:$spec, outcome:$outcome, reason:$reason, status:$status, fix_rounds:$rounds,
          cost_usd:$cost, seconds:$sec}' > "$F/summary.json"
  cat "$F/summary.json"
  exit 0
}

# ------------------------------------------------------------------ G1: spec lint and open questions
log "$UC: G1 spec lint"
python3 "$SPEC_LINT" --docs docs --only "$UC" > "$F/lint.txt" 2>&1
LINT_RC=$?
cat "$F/lint.txt"
endlog
[ $LINT_RC -eq 0 ] || finish blocked "The spec lint found errors in $UC. Fix them in the specification and start the run again."
OQ=$(blocking_questions)
[ -z "$OQ" ] || finish blocked "Blocking open questions on $UC: $OQ. Answer them in the specification first."

# ------------------------------------------------------------------ Implement
station implement "$IMPLEMENT
$ARTIFACT_LOCATIONS
$SPEC_DIFF

$RULES
Do not create or change tests; a separate session writes them."
guard tests implement
commit "implement"
OQ=$(blocking_questions)
[ -z "$OQ" ] || finish blocked "The implementation of $UC stopped on blocking open questions: $OQ."

# ------------------------------------------------------------------ Test
run_tests() {
  station test "$TEST
$ARTIFACT_LOCATIONS
$1

$RULES
The specification is the oracle. A test that disagrees with the code stays failing; do not change production code."
  guard code test
  commit "tests${2:+ ($2)}"
  OQ=$(blocking_questions)
  [ -z "$OQ" ] || finish blocked "Testing $UC stopped on blocking open questions: $OQ."
}
run_tests "" ""

# ------------------------------------------------------------------ Gates and fix loop
mapfile -t BUILD_COMMANDS < <(python3 "$HELPER" commands)
if [ ${#BUILD_COMMANDS[@]} -eq 0 ]; then
  if [ -x ./mvnw ]; then BUILD_COMMANDS=("./mvnw -B -ntp verify")
  elif [ -x ./gradlew ]; then BUILD_COMMANDS=("./gradlew build")
  elif [ -f package.json ]; then BUILD_COMMANDS=("npm ci" "npm test")
  elif ls ./*.sln >/dev/null 2>&1; then BUILD_COMMANDS=("dotnet test")
  else BUILD_COMMANDS=()
  fi
fi

while true; do
  over_budget && finish stuck "The cost budget of \$$MAX_COST_USD for $UC is used up."

  log "$UC: G2-G4 build and tests (round $ROUNDS)"
  BUILD_LOG="$F/build-r$ROUNDS.log"
  : > "$BUILD_LOG"
  BUILD_RC=0
  for cmd in "${BUILD_COMMANDS[@]}"; do
    echo "\$ $cmd" >> "$BUILD_LOG"
    bash -c "$cmd" >> "$BUILD_LOG" 2>&1 || { BUILD_RC=$?; break; }
  done
  tail -n 40 "$BUILD_LOG"
  endlog
  [ ${#BUILD_COMMANDS[@]} -gt 0 ] || finish stuck "No build command: fill the Commands table of docs/architecture/stack.md."

  CODE_GAPS=""; TEST_GAPS=""
  if [ $BUILD_RC -eq 0 ]; then
    [ -n "$AUDIT_AGENT" ] || finish ready "Build and tests are green. $STACK_PLUGIN has no coverage audit, so the status moves to Implemented only." Implemented
    # -------------------------------------------------------------- G5: spec coverage (read-only)
    rm -f "$F/coverage.json"
    station audit "Use $AUDIT_AGENT to audit the use case $UC ($SPEC) against its specification: every main
success scenario step, alternative flow, business rule, precondition and postcondition against the code and tests.
Write the coverage matrix as Markdown to $F/coverage.md and the result to $F/coverage.json:
{\"complete\": true|false, \"code_gaps\": [\"...\"], \"test_gaps\": [\"...\"]}.
Change no other file. Do not run git."
    git checkout -q -- . && git clean -fdq -e .werkstatt/ -e .aiup-werkstatt-engine/   # the audit is read-only
    if [ "$(jq -r '.complete // false' "$F/coverage.json" 2>/dev/null)" = "true" ]; then
      finish ready "All gates are green." Tested
    fi
    CODE_GAPS=$(jq -r '(.code_gaps // []) | map("- " + .) | join("\n")' "$F/coverage.json" 2>/dev/null)
    TEST_GAPS=$(jq -r '(.test_gaps // []) | map("- " + .) | join("\n")' "$F/coverage.json" 2>/dev/null)
    [ -n "$CODE_GAPS$TEST_GAPS" ] || CODE_GAPS="- The coverage audit gave no result; check the code against every step and rule of $SPEC."
  fi

  ROUNDS=$((ROUNDS + 1))
  [ "$ROUNDS" -le "$MAX_ROUNDS" ] || finish stuck "The gates for $UC are still red after $MAX_ROUNDS fix rounds."

  if [ $BUILD_RC -ne 0 ] || [ -n "$CODE_GAPS" ]; then
    FEEDBACK=""
    [ $BUILD_RC -ne 0 ] && FEEDBACK="The build or the tests failed. The end of the log:
~~~text
$(tail -n 150 "$BUILD_LOG")
~~~"
    [ -n "$CODE_GAPS" ] && FEEDBACK="$FEEDBACK
The coverage audit found these gaps in the code:
$CODE_GAPS"
    station fix "$IMPLEMENT
$ARTIFACT_LOCATIONS

Fix round $ROUNDS. Change production code only, never tests.
$FEEDBACK

$RULES
When a failing test contradicts the specification, do not change the test: record a blocking open question."
    guard tests fix
    commit "fix round $ROUNDS"
    OQ=$(blocking_questions)
    [ -z "$OQ" ] || finish blocked "Fix round $ROUNDS of $UC stopped on blocking open questions: $OQ."
  fi

  if [ -n "$TEST_GAPS" ]; then
    run_tests "Add only the missing tests. The coverage audit found these gaps in the tests:
$TEST_GAPS" "round $ROUNDS"
  fi
done
