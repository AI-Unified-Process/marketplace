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
#   2. the deadline: a use case still running is stopped and dropped, the one before it keeps its result.
#   3. a deadline already past: nothing is built, every use case is pending.
#   4. the lanes with awkward paths: a file name with an umlaut, a test moved out of the test folder, .NET test
#      helpers; a use case that is not Approved is skipped, not built; stations that stop without a result end stuck
#      with a row in the report.
#   5. every use case named is not Approved: outcome none, nothing committed.
#   6. select-ucs.sh: an umlaut and a space in a file name, a specification moved into a module folder.
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
# test gap. FAKE_LOG collects the audit prompts. FAKE_LANES names the use cases whose stations cross their lanes on
# awkward paths, FAKE_CRASH the ones whose implementer kills the stations (no summary.json).
prompt="$2"
uc=$(printf '%s' "$prompt" | grep -oE 'UC-[0-9]+' | head -1)
n=${uc#UC-}
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
    case " ${FAKE_LANES:-} " in *" $uc "*) echo "changed by the tester" >> "docs/glossar-prüfung.md" ;; esac
    case " ${FAKE_MAXTURNS:-} " in *" $uc "*)
      echo '{"total_cost_usd": 0.25, "subtype": "error_max_turns"}'; exit 1 ;;
    esac
    ;;
  *use-case-implement*)
    mkdir -p src/main src/test
    echo "class UC${n} {}" > "src/main/UC${n}.java"
    echo "class Sneaky${n}Test {}" > "src/test/Sneaky${n}Test.java"
    case " ${FAKE_LANES:-} " in *" $uc "*)
      echo "class Prüfung${n}Test {}" > "src/test/Prüfung${n}Test.java"
      mkdir -p src/MyApp.Tests/Traceability MyApp.Tests.E2E src/MyApp/Pages
      echo "class UseCaseAttribute {}" > src/MyApp.Tests/Traceability/UseCaseAttribute.cs
      echo "class PlaywrightFixture {}" > MyApp.Tests.E2E/PlaywrightFixture.cs
      echo "<p>test</p>" > src/MyApp/Pages/BookingTests.razor
      mv src/test/ExistingTest.java src/main/Existing.java ;;
    esac
    case " ${FAKE_CRASH:-} " in *" $uc "*) kill -TERM "$PPID" ;; esac
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
    git add -A && git commit -qm fixture
  )
}

# change <dir> <log> [env...]: run-change.sh for UC-001..UC-003 in the fixture
change() {
  local dir="$1" log="$2"; shift 2
  (cd "$dir" && env PATH="$WORK/bin:$PATH" SPEC_LINT="$WORK/bin/spec_lint.py" MAX_TURNS=5 MAX_ROUNDS=1 \
      SPEC_LINT_MODULE="$ENGINE/aiup-core/skills/spec-review/scripts/spec_lint.py" \
      GITHUB_OUTPUT="$dir.output" "$@" \
      bash "$ENGINE/pipelines/werkstatt/run-change.sh" UC-001 UC-002 UC-003 > "$log" 2>&1)
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

# ---------------------------------------------------------------- 4. awkward paths, a Draft use case, a crash
R="$WORK/four"; fixture "$R"
(
  cd "$R" || exit 1
  mkdir -p src/test
  echo "class ExistingTest {}" > src/test/ExistingTest.java
  echo "Glossar" > "docs/glossar-prüfung.md"
  sed 's/^\*\*Status:\*\* Approved/**Status:** Draft/' docs/use_cases/UC-002-case.md > draft.tmp
  mv draft.tmp docs/use_cases/UC-002-case.md
  git add -A && git commit -qm "lanes fixture"
)
change "$R" "$WORK/four.log" FAKE_LANES=UC-001 FAKE_CRASH=UC-003
expect_grep "4 outcome" "^outcome=stuck$" "$R.output"
expect_eq "4 UC-001 outcome" "$(outcome_of "$R" UC-001)" ready
expect_no_file "4 umlaut test of the implementer reverted" "$R/src/test/Prüfung001Test.java"
expect_grep "4 guard names the umlaut path" "src/test/Prüfung001Test.java (reverted)" "$R/.werkstatt/UC-001/guard.log"
expect_eq "4 umlaut file of the tester reverted" "$(cat "$R/docs/glossar-prüfung.md")" Glossar
expect_file "4 test moved out of the test folder restored" "$R/src/test/ExistingTest.java"
expect_no_file "4 .NET test project helper reverted" "$R/src/MyApp.Tests/Traceability/UseCaseAttribute.cs"
expect_no_file "4 .NET E2E project helper reverted" "$R/MyApp.Tests.E2E/PlaywrightFixture.cs"
expect_no_file "4 razor test reverted" "$R/src/MyApp/Pages/BookingTests.razor"
expect_eq "4 UC-002 outcome" "$(outcome_of "$R" UC-002)" skipped
expect_eq "4 UC-002 status" "$(status_of "$R" UC-002)" Draft
expect_no_file "4 UC-002 not built" "$R/src/main/UC002.java"
expect_grep "4 report row skipped" "| UC-002 | \*\*skipped\*\* |" "$R/.werkstatt/report.md"
expect_grep "4 report reason skipped" "UC-002 is Draft, not Approved" "$R/.werkstatt/report.md"
expect_eq "4 UC-003 outcome" "$(outcome_of "$R" UC-003)" stuck
expect_no_file "4 UC-003 code dropped" "$R/src/main/UC003.java"
expect_grep "4 report row of the crash" "| UC-003 | \*\*stuck\*\* |" "$R/.werkstatt/report.md"
expect_grep "4 report reason of the crash" "stopped with exit code 143 before they wrote a result" "$R/.werkstatt/report.md"
expect_eq "4 working tree clean" "$(cd "$R" && git status --porcelain)" ""

# ---------------------------------------------------------------- 5. nothing Approved: outcome none
R="$WORK/five"; fixture "$R"
(
  cd "$R" || exit 1
  for f in docs/use_cases/UC-*.md; do
    sed 's/^\*\*Status:\*\* Approved/**Status:** Obsolete/' "$f" > obsolete.tmp && mv obsolete.tmp "$f"
  done
  git add -A && git commit -qm "obsolete"
)
change "$R" "$WORK/five.log"
expect_grep "5 outcome" "^outcome=none$" "$R.output"
expect_eq "5 nothing committed" "$(cd "$R" && git rev-list --count HEAD)" 2

# ---------------------------------------------------------------- 6. select-ucs.sh
R="$WORK/six"; fixture "$R"
(
  cd "$R" || exit 1
  git update-ref refs/remotes/origin/main HEAD
  mkdir -p docs/use_cases/booking
  git mv docs/use_cases/UC-001-case.md docs/use_cases/booking/UC-001-case.md
  printf '# UC-004: Bestellung\n\n**Status:** Genehmigt\n' > "docs/use_cases/UC-004-bestellung-prüfen.md"
  printf '# UC-005: Space\n\n**Status:** Approved\n' > "docs/use_cases/UC-005-with space.md"
  printf '# UC-006: Draft\n\n**Status:** Draft\n' > "docs/use_cases/UC-006-draft.md"
  git add -A && git commit -qm "change"
)
expect_eq "6 selected" "$(cd "$R" && bash "$ENGINE/pipelines/werkstatt/select-ucs.sh" "$ENGINE" main 2>"$WORK/six.log")" \
  "UC-001 UC-004 UC-005"

if [ "$FAILURES" -gt 0 ]; then
  echo "--- run logs"; tail -n 30 "$WORK"/*.log
  exit 1
fi
echo "self-test passed"
