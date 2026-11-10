#!/usr/bin/env bash
#
# Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
# Part of the AI Unified Process — https://unifiedprocess.ai
# Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
#
# AI Unified Process Werkstatt - runs the stations against a fixture repository with a fake `claude` on the PATH.
#
# No model, no network: the fake plays each station by writing files the way the skills would. Checked:
#   1. ready, blocked, pending: a green use case moves to Tested with its code and its requirements follow, a
#      blocked one keeps only its open question, the next one is not built; the lane guard reverts test code of the
#      implementer and production code of the tester, and keeps the tester's build file; a session cut off by the
#      turn limit is recorded; an audit that finds a gap leads to a test round, and the next audit gets the
#      previous round's matrix.
#      The guard judges a moved file by both of its paths and a non-ASCII path as it is on disk, knows a .NET
#      test project, and keeps the tester's Markers rows in the stack file.
#   2. the deadline: a use case still running is stopped and dropped, the one before it keeps its result.
#   3. a deadline already past: nothing is built, every use case is pending.
#   4. a session that fails once is started again; a named use case that is not Approved or has no specification
#      is skipped and holds nothing up; a blocking question on a linked requirement pulls the andon cord.
#   5. a session that fails twice ends stuck, also where no coverage audit would catch it, and leaves no file.
#   6. select-ucs.sh: a specification moved and approved in one change is selected.
#
# Usage: pipelines/werkstatt/self-test.sh     (CI: validate-plugins.yml)
set -uo pipefail

ENGINE=$(cd "$(dirname "$0")/../.." && pwd)
export ENGINE
WORK=$(mktemp -d)
trap 'rm -rf "$WORK"' EXIT
FAILURES=0

fail() { echo "FAIL $*"; FAILURES=$((FAILURES + 1)); }
expect_eq() { [ "$2" = "$3" ] || fail "$1: expected '$3', got '$2'"; }
expect_file() { [ -e "$2" ] || fail "$1: $2 is missing"; }
expect_no_file() { [ ! -e "$2" ] || fail "$1: $2 should not exist"; }
expect_grep() { grep -q -- "$2" "$3" 2>/dev/null || fail "$1: '$2' not in $3"; }

# ---------------------------------------------------------------- the fake Claude Code
mkdir -p "$WORK/bin"
cat > "$WORK/bin/claude" <<'FAKE'
#!/usr/bin/env bash
# Plays one Werkstatt station. FAKE_BLOCK and FAKE_SLEEP name the use cases that block or hang in the implementer,
# FAKE_MAXTURNS the ones whose test session ends at the turn limit, FAKE_GAPS the ones whose first audit finds a
# test gap, FAKE_FAIL the ones whose every session fails, FAKE_FAIL_ONCE the ones whose first session fails
# (FAKE_STATE holds the marker). FAKE_LOG collects the audit prompts.
prompt="$2"
uc=$(printf '%s' "$prompt" | grep -oE 'UC-[0-9]+' | head -1)
n=${uc#UC-}
failing=0
case " ${FAKE_FAIL:-} " in *" $uc "*) failing=1 ;; esac
case " ${FAKE_FAIL_ONCE:-} " in *" $uc "*)
  [ -e "$FAKE_STATE/$uc.failed" ] || { : > "$FAKE_STATE/$uc.failed"; failing=1; } ;;
esac
if [ "$failing" = 1 ]; then
  echo "scratch" > scratch.tmp
  echo "API Error: 401 invalid x-api-key" >&2
  exit 1
fi
case "$prompt" in
  *uc-coverage*)
    out=$(printf '%s' "$prompt" | grep -oE '\.werkstatt/UC-[0-9]+/coverage\.json' | head -1)
    printf '%s\n----\n' "$prompt" >> "${FAKE_LOG:-/dev/null}"
    echo '| Element | Code | Test |' > "${out%.json}.md"
    case " ${FAKE_GAPS:-} " in
      *" $uc "*) if printf '%s' "$prompt" | grep -q "previous audit's matrix"; then gaps=0; else gaps=1; fi ;;
      *) gaps=0 ;;
    esac
    if [ "$gaps" = 1 ]; then
      echo '{"complete": false, "code_gaps": [], "test_gaps": ["Step 1 has no test"]}' > "$out"
    else
      echo '{"complete": true, "code_gaps": [], "test_gaps": []}' > "$out"
    fi
    echo "audit scribble" > README.md   # the audit is read-only: the harness must undo this
    ;;
  *use-case-test*)
    mkdir -p src/test src/main
    echo "class UC${n}Test {}" > "src/test/UC${n}Test.java"
    echo "<project>test dependency $uc</project>" > pom.xml
    echo "// the tester may not change production code" >> "src/main/UC${n}.java"
    # a moved production file, and the Markers rows the test skills keep in the stack file
    if [ -f src/main/Legacy.java ]; then mkdir -p src/main/moved && mv src/main/Legacy.java src/main/moved/; fi
    grep -q '^## Markers' docs/architecture/stack.md || printf '\n## Markers\n\n| Layer | Test marker |\n|---|---|\n| UI | @UseCase |\n' >> docs/architecture/stack.md
    case " ${FAKE_MAXTURNS:-} " in *" $uc "*)
      echo '{"total_cost_usd": 0.25, "subtype": "error_max_turns"}'; exit 1 ;;
    esac
    ;;
  *use-case-implement*)
    mkdir -p src/main src/test
    echo "class UC${n} {}" > "src/main/UC${n}.java"
    echo "class Sneaky${n}Test {}" > "src/test/Sneaky${n}Test.java"
    # a moved test, a non-ASCII test file, and a file of a .NET test project
    if [ -f src/test/OldTest.java ]; then mkdir -p src/test/moved && mv src/test/OldTest.java src/test/moved/; fi
    echo "class PrüfungTest {}" > "src/test/PrüfungTest.java"
    mkdir -p App.Tests.E2E && echo "class Fixture {}" > App.Tests.E2E/ServerFixture.cs
    case " ${FAKE_BLOCK:-} " in *" $uc "*)
      printf '\n## OQ-0%s: Which rate?\n\n**Element:** %s BR-001\n**Blocking:** Yes\n**Status:** Open\n' \
        "$n" "$uc" >> docs/open_questions.md ;;
    esac
    case " ${FAKE_SLEEP:-} " in *" $uc "*) sleep 300 ;; esac
    ;;
esac
echo '{"total_cost_usd": 0.25, "subtype": "success"}'
FAKE
chmod +x "$WORK/bin/claude"
printf 'print("spec lint: no errors")\n' > "$WORK/bin/spec_lint.py"

# ---------------------------------------------------------------- the fixture repository
# fixture <dir>: three Approved use cases, a stack file whose build always passes
fixture() {
  mkdir -p "$1/docs/use_cases" "$1/docs/architecture"
  (
    cd "$1" || exit 1
    git init -q -b change/test
    git config user.name test; git config user.email test@example.com
    printf '%s\n' ".werkstatt/" >> .git/info/exclude
    for n in 001 002 003; do
      printf '# UC-%s: Case %s\n\n**Status:** Approved\n**Requirements:** [FR-%s, NFR-001](../requirements.md)\n' \
        "$n" "$n" "$n" > "docs/use_cases/UC-$n-case.md"
    done
    {
      printf '# Requirements\n\n## Functional Requirements\n\n'
      printf '| ID | Title | User Story | Use Cases | Priority | Status |\n|---|---|---|---|---|---|\n'
      for n in 001 002 003; do printf '| FR-%s | Case %s | As a user, I want %s. | UC-%s | High | Open |\n' "$n" "$n" "$n" "$n"; done
      printf '\n## Non-Functional Requirements\n\n'
      printf '| ID | Title | Requirement | Category | Use Cases | Priority | Status |\n|---|---|---|---|---|---|---|\n'
      printf '| NFR-001 | Fields | Errors at the field. | Usability | UC-001, UC-002, UC-003 | High | Open |\n'
    } > docs/requirements.md
    printf '# Open Questions\n' > docs/open_questions.md
    printf '# Stack\n\n## Commands\n\n| Purpose | Command |\n|---|---|\n| Build | `true` |\n' \
      > docs/architecture/stack.md
    echo "readme" > README.md
    mkdir -p src/main src/test
    echo "class Legacy {}" > src/main/Legacy.java
    echo "class OldTest {}" > src/test/OldTest.java
    git add -A && git commit -qm fixture
  )
}

# change <dir> <log> [env...]: run-change.sh for UC-001..UC-003 in the fixture (IDS=... names other ids)
change() {
  local dir="$1" log="$2" ids="UC-001 UC-002 UC-003" arg; shift 2
  for arg in "$@"; do case "$arg" in IDS=*) ids="${arg#IDS=}" ;; esac; done
  mkdir -p "$dir.state"
  # shellcheck disable=SC2086
  (cd "$dir" && env PATH="$WORK/bin:$PATH" SPEC_LINT="$WORK/bin/spec_lint.py" MAX_TURNS=5 MAX_ROUNDS=1 \
      SPEC_LINT_MODULE="$ENGINE/aiup-core/skills/spec-review/scripts/spec_lint.py" \
      GITHUB_OUTPUT="$dir.output" RETRY_WAIT=0 FAKE_STATE="$dir.state" "$@" \
      bash "$ENGINE/pipelines/werkstatt/run-change.sh" $ids > "$log" 2>&1)
}

outcome_of() { jq -r .outcome "$1/.werkstatt/$2/summary.json" 2>/dev/null; }
status_of() { sed -n 's/^\*\*Status:\*\* *//p' "$1/docs/use_cases/$2-case.md"; }

# ---------------------------------------------------------------- 1. ready, blocked, pending
R="$WORK/one"; fixture "$R"
change "$R" "$WORK/one.log" FAKE_BLOCK=UC-002 FAKE_MAXTURNS=UC-001 FAKE_GAPS=UC-001 FAKE_LOG="$WORK/audits.log"
expect_grep "1 outcome" "^outcome=blocked$" "$R.output"
expect_eq "1 UC-001 outcome" "$(outcome_of "$R" UC-001)" ready
expect_eq "1 UC-001 status" "$(status_of "$R" UC-001)" Tested
expect_file "1 UC-001 code" "$R/src/main/UC001.java"
expect_file "1 UC-001 test" "$R/src/test/UC001Test.java"
expect_no_file "1 implementer test reverted" "$R/src/test/Sneaky001Test.java"
expect_eq "1 tester production change reverted" "$(cat "$R/src/main/UC001.java")" "class UC001 {}"
expect_grep "1 tester build file kept" "UC-001" "$R/pom.xml"
expect_grep "1 guard lists the build file" "build file pom.xml (kept)" "$R/.werkstatt/UC-001/guard.log"
expect_grep "1 guard lists the revert" "Sneaky001Test.java (reverted)" "$R/.werkstatt/UC-001/guard.log"
expect_eq "1 audit left no change" "$(cat "$R/README.md")" readme
expect_file "1 implementer's moved test is back" "$R/src/test/OldTest.java"
expect_no_file "1 implementer's moved test: new path gone" "$R/src/test/moved/OldTest.java"
expect_file "1 tester's moved production file is back" "$R/src/main/Legacy.java"
expect_no_file "1 tester's moved production file: new path gone" "$R/src/main/moved/Legacy.java"
expect_no_file "1 non-ASCII test file of the implementer reverted" "$R/src/test/PrüfungTest.java"
expect_grep "1 guard names the non-ASCII path as it is" "src/test/PrüfungTest.java (reverted)" "$R/.werkstatt/UC-001/guard.log"
expect_no_file "1 .NET test project file of the implementer reverted" "$R/App.Tests.E2E/ServerFixture.cs"
expect_grep "1 tester's Markers rows kept" "^## Markers" "$R/docs/architecture/stack.md"
expect_grep "1 guard lists the stack file" "stack file docs/architecture/stack.md (kept)" "$R/.werkstatt/UC-001/guard.log"
expect_eq "1 UC-002 outcome" "$(outcome_of "$R" UC-002)" blocked
expect_eq "1 UC-002 status" "$(status_of "$R" UC-002)" Approved
expect_no_file "1 UC-002 code dropped" "$R/src/main/UC002.java"
expect_grep "1 UC-002 open question kept" "OQ-0002" "$R/docs/open_questions.md"
expect_eq "1 UC-003 outcome" "$(outcome_of "$R" UC-003)" pending
expect_eq "1 UC-003 status" "$(status_of "$R" UC-003)" Approved
expect_grep "1 report row" "| UC-001 | \*\*ready\*\* | Approved -> Tested |" "$R/.werkstatt/report.md"
expect_grep "1 report waits" "waits for UC-002" "$R/.werkstatt/report.md"
expect_grep "1 FR-001 follows UC-001" "| FR-001 | Case 001 | As a user, I want 001. | UC-001 | High | Verified |" \
  "$R/docs/requirements.md"
expect_grep "1 NFR-001 in progress" "| NFR-001 | Fields | Errors at the field. | Usability | UC-001, UC-002, UC-003 | High | In Progress |" \
  "$R/docs/requirements.md"
expect_grep "1 FR-002 unchanged" "| FR-002 | Case 002 | As a user, I want 002. | UC-002 | High | Open |" "$R/docs/requirements.md"
expect_grep "1 report lists the requirements" "Requirements: FR-001: Open -> Verified, NFR-001: Open -> In Progress" \
  "$R/.werkstatt/report.md"
expect_grep "1 turn limit in the report" "test session of round 0 stopped at the turn limit (max_turns 5)" "$R/.werkstatt/report.md"
expect_grep "1 turn limit in the metrics" '"station":"test","round":0,"exit":1,"subtype":"error_max_turns"' \
  "$R/.werkstatt/UC-001/metrics.jsonl"
expect_eq "1 UC-001 one test round" "$(jq -r .fix_rounds "$R/.werkstatt/UC-001/summary.json")" 1
expect_file "1 matrix of round 0 kept" "$R/.werkstatt/UC-001/coverage-r0.md"
expect_file "1 matrix of round 1 kept" "$R/.werkstatt/UC-001/coverage-r1.md"
expect_grep "1 audit asks for every gap" "Report every gap you find in one pass" "$WORK/audits.log"
expect_grep "1 second audit gets the previous matrix" "previous audit's matrix is .werkstatt/UC-001/coverage-r0.md" \
  "$WORK/audits.log"
expect_eq "1 working tree clean" "$(cd "$R" && git status --porcelain)" ""

# ---------------------------------------------------------------- 2. the deadline stops a running use case
if command -v timeout >/dev/null; then
  R="$WORK/two"; fixture "$R"
  change "$R" "$WORK/two.log" FAKE_SLEEP=UC-002 DEADLINE=$(( $(date +%s) + 20 ))
  expect_grep "2 outcome" "^outcome=stuck$" "$R.output"
  expect_eq "2 UC-001 outcome" "$(outcome_of "$R" UC-001)" ready
  expect_eq "2 UC-001 status" "$(status_of "$R" UC-001)" Tested
  expect_file "2 UC-001 code kept" "$R/src/main/UC001.java"
  expect_eq "2 UC-002 outcome" "$(outcome_of "$R" UC-002)" stuck
  expect_grep "2 UC-002 reason" "timeout_minutes" "$R/.werkstatt/UC-002/summary.json"
  expect_no_file "2 UC-002 code dropped" "$R/src/main/UC002.java"
  expect_grep "2 UC-002 diff kept" "class UC002" "$R/.werkstatt/UC-002/dropped.diff"
  expect_eq "2 UC-003 outcome" "$(outcome_of "$R" UC-003)" pending
  expect_eq "2 working tree clean" "$(cd "$R" && git status --porcelain)" ""
  pgrep -f "sleep 300" >/dev/null && fail "2 the stopped session still runs"

  # ------------------------------------------------------------ 3. a deadline already past builds nothing
  R="$WORK/three"; fixture "$R"
  change "$R" "$WORK/three.log" DEADLINE=$(( $(date +%s) - 1 ))
  expect_grep "3 outcome" "^outcome=pending$" "$R.output"
  for uc in UC-001 UC-002 UC-003; do
    expect_eq "3 $uc outcome" "$(outcome_of "$R" "$uc")" pending
  done
  expect_eq "3 nothing committed" "$(cd "$R" && git rev-list --count HEAD)" 1
else
  echo "SKIP the deadline scenarios: no timeout command (GNU coreutils)"
fi

# ---------------------------------------------------------------- 4. retry, skipped, and a question on a requirement
R="$WORK/four"; fixture "$R"
(
  cd "$R" || exit 1
  sed -i.bak 's/^\*\*Status:\*\* Approved/**Status:** Draft/' docs/use_cases/UC-002-case.md && rm docs/use_cases/UC-002-case.md.bak
  printf '\n## OQ-001: Which fields?\n\n**Element:** FR-003\n**Blocking:** Yes\n**Status:** Open\n' >> docs/open_questions.md
  git add -A && git commit -qm "draft and question"
)
change "$R" "$WORK/four.log" IDS="UC-001 UC-002 UC-009 UC-003" FAKE_FAIL_ONCE=UC-001
expect_grep "4 outcome" "^outcome=blocked$" "$R.output"
expect_eq "4 UC-001 outcome after one failed session" "$(outcome_of "$R" UC-001)" ready
expect_grep "4 failed session in the metrics" '"failed":true' "$R/.werkstatt/UC-001/metrics.jsonl"
expect_grep "4 failed session in the report" "implement session of round 0 failed (exit 1) and was started once more" "$R/.werkstatt/report.md"
expect_eq "4 UC-002 skipped" "$(outcome_of "$R" UC-002)" skipped
expect_grep "4 UC-002 reason" "status of UC-002 is Draft" "$R/.werkstatt/report.md"
expect_eq "4 UC-002 status" "$(status_of "$R" UC-002)" Draft
expect_no_file "4 UC-002 not built" "$R/src/main/UC002.java"
expect_eq "4 UC-009 skipped" "$(outcome_of "$R" UC-009)" skipped
expect_grep "4 UC-009 reason" "no specification for UC-009" "$R/.werkstatt/report.md"
expect_eq "4 UC-003 blocked by the question on FR-003" "$(outcome_of "$R" UC-003)" blocked
expect_grep "4 UC-003 reason" "Blocking open questions on UC-003: OQ-001" "$R/.werkstatt/UC-003/summary.json"
expect_eq "4 working tree clean" "$(cd "$R" && git status --porcelain)" ""

# ---------------------------------------------------------------- 5. a session that fails twice is never green
R="$WORK/five"; fixture "$R"
change "$R" "$WORK/five.log" FAKE_FAIL=UC-001 STACK_PLUGIN=aiup-blazor-dotnet
expect_grep "5 outcome" "^outcome=stuck$" "$R.output"
expect_eq "5 UC-001 outcome" "$(outcome_of "$R" UC-001)" stuck
expect_grep "5 UC-001 reason" "implement session of UC-001 failed twice (exit 1): API Error: 401" "$R/.werkstatt/UC-001/summary.json"
expect_eq "5 UC-001 status" "$(status_of "$R" UC-001)" Approved
expect_no_file "5 untracked file of the failed session removed" "$R/scratch.tmp"
expect_eq "5 UC-002 outcome" "$(outcome_of "$R" UC-002)" pending
expect_eq "5 nothing committed" "$(cd "$R" && git rev-list --count HEAD)" 1
expect_eq "5 working tree clean" "$(cd "$R" && git status --porcelain)" ""

R="$WORK/five-b"; fixture "$R"
change "$R" "$WORK/five-b.log" IDS="UC-008 UC-009"
expect_grep "5 only skipped use cases: outcome none" "^outcome=none$" "$R.output"

# ---------------------------------------------------------------- 6. select-ucs.sh
R="$WORK/six"; fixture "$R"
SELECTED=$(
  cd "$R" || exit 1
  git update-ref refs/remotes/origin/main HEAD
  mkdir -p docs/use_cases/booking
  git mv docs/use_cases/UC-001-case.md docs/use_cases/booking/UC-001-case.md
  echo "One more line." >> docs/use_cases/booking/UC-001-case.md
  echo "Changed." >> docs/use_cases/UC-002-case.md
  sed -i.bak 's/^\*\*Status:\*\* Approved/**Status:** Draft/' docs/use_cases/UC-003-case.md && rm docs/use_cases/UC-003-case.md.bak
  printf '# UC-004: Größe\n\n**Status:** Approved\n' > "docs/use_cases/UC-004-größe ändern.md"
  git add -A && git commit -qm change
  bash "$ENGINE/pipelines/werkstatt/select-ucs.sh" "$ENGINE" main
)
expect_eq "6 moved, changed and new Approved specifications" "$SELECTED" "UC-001 UC-002 UC-004"

if [ "$FAILURES" -gt 0 ]; then
  echo "--- run logs"; tail -n 30 "$WORK"/*.log
  exit 1
fi
echo "self-test passed"
