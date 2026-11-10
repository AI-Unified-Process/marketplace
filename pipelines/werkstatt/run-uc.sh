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
#   ready    all gates green; the status moves to Tested (Implemented when no coverage audit exists for the stack),
#            and the requirements the use case links follow it (werkstatt.py requirements)
#   blocked  a blocking open question names the use case (the andon cord), or the spec lint fails;
#            only the new open questions stay, the code of this use case is dropped
#   stuck    the gates stay red after MAX_ROUNDS fix rounds, the cost budget is used up, or a session failed
#            twice (no access, an unknown model, a rate limit); the code is dropped and kept as a diff in the
#            run records
#
# Env: UC, ENGINE (marketplace checkout), MODEL, MAX_TURNS, MAX_ROUNDS, MAX_COST_USD, STACK_PLUGIN (empty for
#      layer plugins), DEFAULT_BRANCH, ARTIFACT_LOCATIONS (a hint in the prompts only: the Werkstatt itself reads
#      docs/), SPEC_LINT, RETRY_WAIT (seconds before a failed session is started once more, default 30)
# Writes .werkstatt/<UC>/summary.json and the records of every station.
set -uo pipefail

UC="${UC:?UC is required, e.g. UC-003}"
ENGINE="${ENGINE:?ENGINE is required}"
MODEL="${MODEL:-claude-opus-5-5}"
MAX_TURNS="${MAX_TURNS:-150}"
MAX_ROUNDS="${MAX_ROUNDS:-4}"
MAX_COST_USD="${MAX_COST_USD:-15}"
STACK_PLUGIN="${STACK_PLUGIN:-}"
DEFAULT_BRANCH="${DEFAULT_BRANCH:-main}"
ARTIFACT_LOCATIONS="${ARTIFACT_LOCATIONS:-}"
HELPER="$ENGINE/pipelines/werkstatt/werkstatt.py"
# Test code by path: Java/Kotlin test sources, test folders, TypeScript test files, and .NET test files: any file in a
# .NET test project folder (a name that ends in .Tests or holds .Tests., such as MyApp.Tests or MyApp.Tests.E2E, for
# helpers like a fixture or an attribute) and *Test(s).cs or *Test(s).razor anywhere.
TEST_REGEX="${TEST_REGEX:-(^|/)(src/test|test|tests|e2e|__tests__)/|(^|/)[^/]*\\.Tests(\\.[^/]*)?/|\\.(spec|test)\\.[cm]?[jt]sx?\$|Tests?\\.(cs|razor)\$}"
# Build files: the tester may add a test dependency or adjust a test runner's configuration. Kept, and listed.
BUILD_REGEX="${BUILD_REGEX:-(^|/)(pom\\.xml|build\\.gradle(\\.kts)?|settings\\.gradle(\\.kts)?|gradle/libs\\.versions\\.toml|package(-lock)?\\.json|pnpm-lock\\.yaml|yarn\\.lock|angular\\.json|tsconfig[^/]*\\.json|[^/]*\\.config\\.[cm]?[jt]s|[^/]*\\.csproj|Directory\\.(Packages|Build)\\.props)\$}"
OQ_FILE=docs/open_questions.md
# The test skills keep the Markers table of the stack file; the tester's change to it is kept, and listed.
STACK_FILE=docs/architecture/stack.md
RETRY_WAIT="${RETRY_WAIT:-30}"

F=".werkstatt/$UC"
mkdir -p "$F"
TOTAL_COST=0
ROUNDS=0
LAST_COVERAGE=""   # the matrix of the previous audit, kept per round as coverage-r<round>.md
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

# The diff of the specification against the default branch makes removals visible (as in aiup-generate). Against
# the merge base, not the tip: a change made on the default branch after branching is no removal of this change.
SPEC_DIFF=""
if git rev-parse -q --verify "origin/$DEFAULT_BRANCH" >/dev/null; then
  DIFF_BASE=$(git merge-base "origin/$DEFAULT_BRANCH" HEAD 2>/dev/null || echo "origin/$DEFAULT_BRANCH")
  d=$(git diff "$DIFF_BASE" HEAD -- "$SPEC")
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

# session <name> <prompt>: one headless session. Returns 1 when the session itself failed - a non-zero exit or
# a result that is no JSON - which is not the same as a session that worked and was cut off by the turn limit.
session() {
  local name="$1" prompt="$2" out="$F/session-$1-r$ROUNDS.json" t0 rc cost subtype failed=0
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
  case "$cost" in ''|*[!0-9.]*) cost=0 ;; esac
  TOTAL_COST=$(awk -v a="$TOTAL_COST" -v b="$cost" 'BEGIN{printf "%.4f", a+b}')
  # A session cut off by --max-turns ends with this subtype; its half-done work goes on to the gates all the same,
  # but the report says why a round may have been wasted.
  subtype=$(jq -r '.subtype // ""' "$out" 2>/dev/null || true)
  if [ "$subtype" = "error_max_turns" ]; then
    echo "::warning::$UC: the $name station stopped at the turn limit (max_turns $MAX_TURNS)."
    echo "The $name session of round $ROUNDS stopped at the turn limit (max_turns $MAX_TURNS)." >> "$F/notes.log"
  elif [ "$rc" -ne 0 ] || ! jq -e 'type == "object"' "$out" >/dev/null 2>&1; then
    failed=1
  fi
  jq -cn --arg uc "$UC" --arg st "$name" --argjson round "$ROUNDS" --argjson rc "$rc" --arg subtype "$subtype" \
        --argjson cost "$cost" --argjson sec "$(( $(date +%s) - t0 ))" --argjson failed "$failed" \
        '{uc:$uc, station:$st, round:$round, exit:$rc, subtype:$subtype, cost_usd:$cost, seconds:$sec}
         + (if $failed == 1 then {failed:true} else {} end)' \
        >> "$F/metrics.jsonl"
  echo "exit=$rc subtype=$subtype cost=$cost total=$TOTAL_COST"
  SESSION_RC=$rc
  return $failed
}

# station <name> <prompt>
# A failed session is started once more; when it fails again, nothing was built and the gates would only judge
# the code that was there before, so the use case ends stuck instead of green.
station() {
  local name="$1" detail
  log "$UC: $name (round $ROUNDS)"
  if ! session "$@"; then
    echo "::warning::$UC: the $name session failed (exit $SESSION_RC); starting it once more."
    echo "The $name session of round $ROUNDS failed (exit $SESSION_RC) and was started once more." >> "$F/notes.log"
    cp "$F/session-$name-r$ROUNDS.json" "$F/session-$name-r$ROUNDS.failed.json" 2>/dev/null || true
    cp "$F/session-$name-r$ROUNDS.err" "$F/session-$name-r$ROUNDS.failed.err" 2>/dev/null || true
    sleep "$RETRY_WAIT"
    if ! session "$@"; then
      detail=$(jq -r '.result // empty' "$F/session-$name-r$ROUNDS.json" 2>/dev/null | head -n 1 | cut -c1-200)
      [ -n "$detail" ] || detail=$(grep -v '^[[:space:]]*$' "$F/session-$name-r$ROUNDS.err" 2>/dev/null | tail -n 1 | cut -c1-200)
      endlog
      finish stuck "The $name session of $UC failed twice (exit $SESSION_RC)${detail:+: $detail}. Check the AI access, the model and the limits of the account, then start the run again."
    fi
  fi
  endlog
}

over_budget() { awk -v t="$TOTAL_COST" -v m="$MAX_COST_USD" 'BEGIN{exit !(t>m)}'; }

# Harness rule: a station may only change its own kind of file. Everything else is reverted.
#   guard tests  -> the implementer may not touch test code
#   guard code   -> the tester may only touch test code, build files and the stack file (both listed) and the
#                   open questions
guard() {
  local mode="$1" file
  git add -A
  while IFS= read -r -d '' file; do
    [ -n "$file" ] || continue
    if [ "$mode" = code ] && ! [[ "$file" =~ $TEST_REGEX ]]; then
      if [[ "$file" =~ $BUILD_REGEX ]]; then
        echo "$2 changed the build file $file (kept)" >> "$F/guard.log"
        continue
      fi
      if [ "$file" = "$STACK_FILE" ]; then
        echo "$2 changed the stack file $file (kept)" >> "$F/guard.log"
        continue
      fi
    fi
    if [ "$mode" = tests ] && [[ "$file" =~ $TEST_REGEX ]]; then :
    elif [ "$mode" = code ] && ! [[ "$file" =~ $TEST_REGEX ]] && [ "$file" != "$OQ_FILE" ]; then :
    else continue
    fi
    echo "::warning::$UC: the $2 station changed $file; reverted."
    echo "$2 changed $file (reverted)" >> "$F/guard.log"
    git rm -q --cached -- "$file" 2>/dev/null || true
    if git cat-file -e "HEAD:$file" 2>/dev/null; then git checkout -q HEAD -- "$file"; else rm -f -- "$file"; fi
  # NUL-separated and unquoted, so a path with an umlaut or a space is the real path; without rename detection, so a
  # moved file lists both its old and its new path and a test moved out of the test folder is restored.
  done < <(git -c core.quotePath=false diff --cached --name-only --no-renames -z HEAD)
  git reset -q
}

# drop: back to where the use case started, untracked files included; what is dropped stays as a diff in the records.
drop() {
  git add -A
  git diff --cached "$START_SHA" > "$F/dropped.diff"
  git reset -q --hard "$START_SHA"
  git clean -fdq -e .werkstatt/ -e .aiup-werkstatt-engine/
}

commit() {
  git add -A
  git diff --cached --quiet || git commit -qm "werkstatt($UC): $1"
}

blocking_questions() { python3 "$HELPER" blocking "$UC" | paste -sd, - | sed 's/,/, /g'; }

finish() {
  local outcome="$1" reason="$2" status="" reqs=""
  case "$outcome" in
    blocked)
      # Only the open questions stay; the code of an unfinished use case is no proposal.
      git add -A
      git diff --cached "$START_SHA" -- "$OQ_FILE" > "$F/oq.patch"
      drop
      [ -s "$F/oq.patch" ] && git apply "$F/oq.patch" && commit "open questions" ;;
    stuck)
      drop ;;
    ready)
      status=$(python3 "$HELPER" advance "$SPEC" "$3")
      # The requirements the use case links follow its new status, so the catalog shows no REQ_STATUS_DRIFT.
      reqs=$(python3 "$HELPER" requirements "$UC" | paste -sd, - | sed 's/,/, /g')
      commit "status $status${reqs:+; $reqs}" ;;
  esac
  jq -n --arg uc "$UC" --arg spec "$SPEC" --arg outcome "$outcome" --arg reason "$reason" --arg status "$status" \
        --arg reqs "$reqs" \
        --argjson rounds "$ROUNDS" --argjson cost "$TOTAL_COST" --argjson sec "$(( $(date +%s) - START_TIME ))" \
        '{uc:$uc, spec:$spec, outcome:$outcome, reason:$reason, status:$status, requirements:$reqs,
          fix_rounds:$rounds, cost_usd:$cost, seconds:$sec}' > "$F/summary.json"
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
# A read loop, not mapfile: the stations also run in the bash 3.2 of macOS.
BUILD_COMMANDS=()
while IFS= read -r line; do [ -n "$line" ] && BUILD_COMMANDS+=("$line"); done < <(python3 "$HELPER" commands)
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
  for cmd in ${BUILD_COMMANDS[@]+"${BUILD_COMMANDS[@]}"}; do
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
    rm -f "$F/coverage.json" "$F/coverage.md"
    # Every gap costs a fix or test round, so the audit reports all of them at once; a later audit re-checks the
    # whole matrix of the previous one instead of stopping at the first new gap it finds.
    PREVIOUS=""
    [ -n "$LAST_COVERAGE" ] && PREVIOUS="The previous audit's matrix is $LAST_COVERAGE; the gaps it listed were worked
on since. Check every row of it again, and look for what it may have missed, before you decide."
    station audit "Use $AUDIT_AGENT to audit the use case $UC ($SPEC) against its specification: every main
success scenario step, alternative flow, business rule, precondition and postcondition against the code and tests.
Report every gap you find in one pass, not only the first ones: each gap left for a later audit costs another round.
$PREVIOUS
Write the coverage matrix as Markdown to $F/coverage.md and the result to $F/coverage.json:
{\"complete\": true|false, \"code_gaps\": [\"...\"], \"test_gaps\": [\"...\"]}.
Change no other file. Do not run git."
    git checkout -q -- . && git clean -fdq -e .werkstatt/ -e .aiup-werkstatt-engine/   # the audit is read-only
    if [ -f "$F/coverage.md" ]; then
      cp "$F/coverage.md" "$F/coverage-r$ROUNDS.md"
      LAST_COVERAGE="$F/coverage-r$ROUNDS.md"
    fi
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
