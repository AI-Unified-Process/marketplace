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
#      The tester's Markers rows in the stack file are kept and listed.
#   2. the deadline: a use case still running is stopped and dropped, the one before it keeps its result.
#   3. a deadline already past: nothing is built, every use case is pending.
#   4. the lanes with awkward paths: a file name with an umlaut, a test moved out of the test folder, .NET test
#      helpers; a use case that is not Approved is skipped, not built; stations that stop without a result end stuck
#      with a row in the report.
#   5. every use case named is not Approved: outcome none, nothing committed.
#   6. select-ucs.sh: an umlaut and a space in a file name, a specification moved into a module folder.
#   7. a session that fails once is started again and the use case still ends ready; a session that fails twice
#      ends stuck, also where no coverage audit would catch it, and leaves no untracked file behind.
#   8. a red build caused by a test: the implementer cannot repair it, the tester gets the new log in the same round
#      and does; the specification diff reaches the implementer, the tester and the fix station; an id named twice
#      is built once and reported once.
#   9. a spec lint that fails itself (exit 2) ends the use case stuck, not blocked.
#  10. a question the lint rejects (`**Blocking:** Yes (...)`) blocks the use case, although no parser reads it as
#      blocking; the question stays, the code is dropped.
# Where setsid exists (Linux), 2 also checks that a process that outlives the stopped stations is killed before it
# writes into the working tree.
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
# awkward paths, FAKE_CRASH the ones whose implementer kills the stations (no summary.json). FAKE_FAIL names the
# use cases whose every session fails, FAKE_FAIL_ONCE the ones whose first session fails (FAKE_STATE holds the mark).
# FAKE_BADTEST names the use cases whose tester first writes a test that breaks the build and repairs it when asked,
# FAKE_BADQ the ones whose implementer writes a question the lint rejects. FAKE_PROMPTS is a folder that collects
# every prompt as <station>-<uc>.log.
prompt="$2"
uc=$(printf '%s' "$prompt" | grep -oE 'UC-[0-9]+' | head -1)
n=${uc#UC-}
if [ -n "${FAKE_PROMPTS:-}" ]; then
  case "$prompt" in
    *uc-coverage*) kind=audit ;;
    *use-case-test*) kind=test ;;
    *"Fix round"*) kind=fix ;;
    *) kind=implement ;;
  esac
  mkdir -p "$FAKE_PROMPTS"
  printf '%s\n----\n' "$prompt" >> "$FAKE_PROMPTS/$kind-$uc.log"
fi
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
    case " ${FAKE_BADTEST:-} " in *" $uc "*)
      # a test that does not compile, until the tester is asked to repair it
      printf '%s' "$prompt" | grep -q "Repair round" || echo "class UC${n}Test { BROKEN }" > "src/test/UC${n}Test.java" ;;
    esac
    echo "<project>test dependency $uc</project>" > pom.xml
    echo "// the tester may not change production code" >> "src/main/UC${n}.java"
    # the Markers rows the test skills keep in the stack file
    grep -q '^## Markers' docs/architecture/stack.md || printf '\n## Markers\n\n| Layer | Test marker |\n|---|---|\n| UI | @UseCase |\n' >> docs/architecture/stack.md
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
    case " ${FAKE_BADQ:-} " in *" $uc "*)
      printf '\n## OQ-0%s: Which rate?\n\n**Element:** %s BR-001\n**Blocking:** Yes (decides the result)\n**Status:** Open\n' \
        "$n" "$uc" >> docs/open_questions.md ;;
    esac
    case " ${FAKE_SLEEP:-} " in *" $uc "*)
      # a process that takes its time over the stop signal and writes into the tree after the use case was dropped
      ( trap 'sleep 3; echo late > written-after-the-drop.txt' TERM; sleep 300 ) > /dev/null 2>&1 &
      sleep 300 ;;
    esac
    ;;
esac
echo '{"total_cost_usd": 0.25, "subtype": "success"}'
FAKE
chmod +x "$WORK/bin/claude"
# The fake lint: FAKE_LINT_RC makes it fail itself; --questions rejects a blocking value that is not Yes or No.
cat > "$WORK/bin/spec_lint.py" <<'LINT'
import os, sys
rc = int(os.environ.get("FAKE_LINT_RC", "0"))
if rc:
    print("spec_lint.py: no such directory: docs")
    sys.exit(rc)
if "--questions" in sys.argv:
    try:
        text = open("docs/open_questions.md", encoding="utf-8").read()
    except OSError:
        text = ""
    if "**Blocking:** Yes (" in text:
        print("ERROR OQ_INVALID docs/open_questions.md: **Blocking:** is 'Yes (decides the result)', not Yes or No")
        sys.exit(1)
print("spec lint: no errors")
LINT

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
    # The project's legend gives Tested its own colour; a ready use case is drawn in it.
    printf '%s\n' '@startuml' 'usecase "UC-001\nCase 001" as UC001 #PaleTurquoise' \
      'usecase "UC-002\nCase 002" as UC002 #PaleTurquoise' 'legend right' '  |<#PaleTurquoise>| Status: Approved |' '  |<#PaleGreen>| Status: Tested |' 'endlegend' '@enduml' \
      > docs/use_cases.puml
    printf '# Stack\n\n## Commands\n\n| Purpose | Command |\n|---|---|\n| Build | `true` |\n' \
      > docs/architecture/stack.md
    echo "readme" > README.md
    git add -A && git commit -qm fixture
  )
}

# change <dir> <log> [env...]: run-change.sh for UC-001..UC-003 in the fixture, or for the ids in CHANGE_UCS
change() {
  local dir="$1" log="$2"; shift 2
  mkdir -p "$dir.state"
  (cd "$dir" && env PATH="$WORK/bin:$PATH" SPEC_LINT="$WORK/bin/spec_lint.py" MAX_TURNS=5 MAX_ROUNDS=1 \
      SPEC_LINT_MODULE="$ENGINE/aiup-core/skills/spec-review/scripts/spec_lint.py" \
      GITHUB_OUTPUT="$dir.output" RETRY_WAIT=0 FAKE_STATE="$dir.state" "$@" \
      bash "$ENGINE/pipelines/werkstatt/run-change.sh" ${CHANGE_UCS:-UC-001 UC-002 UC-003} > "$log" 2>&1)
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
expect_grep "1 tester's Markers rows kept" "^## Markers" "$R/docs/architecture/stack.md"
expect_grep "1 guard lists the stack file" "stack file docs/architecture/stack.md (kept)" "$R/.werkstatt/UC-001/guard.log"
expect_grep "1 UC-001 drawn in the legend's colour of Tested" 'as UC001 #PaleGreen$' "$R/docs/use_cases.puml"
expect_grep "1 UC-002 colour unchanged" 'as UC002 #PaleTurquoise$' "$R/docs/use_cases.puml"
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
  if command -v setsid >/dev/null && setsid --help 2>&1 | grep -q -- '--wait'; then
    # the stations ran in their own session: what outlived them was killed before it could write
    sleep 8
    expect_no_file "2 nothing written after the drop" "$R/written-after-the-drop.txt"
    expect_eq "2 working tree still clean" "$(cd "$R" && git status --porcelain)" ""
  else
    echo "SKIP the check for processes that outlive the stations: no setsid --wait (util-linux)"
  fi

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

# ---------------------------------------------------------------- 7. failed sessions
R="$WORK/seven"; fixture "$R"
change "$R" "$WORK/seven.log" FAKE_FAIL_ONCE=UC-001 FAKE_BLOCK=UC-002
expect_eq "7 UC-001 ready after one failed session" "$(outcome_of "$R" UC-001)" ready
expect_grep "7 failed session in the metrics" '"failed":true' "$R/.werkstatt/UC-001/metrics.jsonl"
expect_grep "7 failed session in the report" "implement session of round 0 failed (exit 1) and was started once more" "$R/.werkstatt/report.md"
expect_eq "7 working tree clean" "$(cd "$R" && git status --porcelain)" ""

R="$WORK/seven-b"; fixture "$R"
change "$R" "$WORK/seven-b.log" FAKE_FAIL=UC-001 STACK_PLUGIN=aiup-blazor-dotnet
expect_grep "7 outcome" "^outcome=stuck$" "$R.output"
expect_eq "7 UC-001 stuck after two failed sessions" "$(outcome_of "$R" UC-001)" stuck
expect_grep "7 UC-001 reason" "implement session of UC-001 failed twice (exit 1): API Error: 401" "$R/.werkstatt/UC-001/summary.json"
expect_eq "7 UC-001 status" "$(status_of "$R" UC-001)" Approved
expect_no_file "7 untracked file of the failed session removed" "$R/scratch.tmp"
expect_eq "7 UC-002 outcome" "$(outcome_of "$R" UC-002)" pending
expect_eq "7 nothing committed" "$(cd "$R" && git rev-list --count HEAD)" 1
expect_eq "7 working tree clean" "$(cd "$R" && git status --porcelain)" ""

# ---------------------------------------------------------------- 8. a test breaks the build; the spec diff; an id twice
R="$WORK/eight"; fixture "$R"
(
  cd "$R" || exit 1
  printf '1. The old step that is removed.\n' >> docs/use_cases/UC-001-case.md
  # the build fails while a test holds the marker of the fake's broken test
  printf '# Stack\n\n## Commands\n\n| Purpose | Command |\n|---|---|\n| Build | `! grep -rq BROKEN src/test` |\n' \
    > docs/architecture/stack.md
  git add -A && git commit -qm "default branch"
  git update-ref refs/remotes/origin/main HEAD
  grep -v 'old step' docs/use_cases/UC-001-case.md > spec.tmp && mv spec.tmp docs/use_cases/UC-001-case.md
  git add -A && git commit -qm "change: the step is removed"
)
CHANGE_UCS="UC-001 UC-001" change "$R" "$WORK/eight.log" FAKE_BADTEST=UC-001 FAKE_PROMPTS="$WORK/eight.prompts"
expect_grep "8 outcome" "^outcome=ready$" "$R.output"
expect_grep "8 use cases named once" "^use_cases=UC-001$" "$R.output"
expect_eq "8 UC-001 outcome" "$(outcome_of "$R" UC-001)" ready
expect_eq "8 UC-001 status" "$(status_of "$R" UC-001)" Tested
expect_eq "8 UC-001 one round" "$(jq -r .fix_rounds "$R/.werkstatt/UC-001/summary.json")" 1
expect_eq "8 the stations" "$(jq -r .station "$R/.werkstatt/UC-001/metrics.jsonl" | paste -sd' ' -)" \
  "implement test fix test audit"
expect_eq "8 the test was repaired" "$(cat "$R/src/test/UC001Test.java")" "class UC001Test {}"
expect_file "8 build log after the fix" "$R/.werkstatt/UC-001/build-r1-fix.log"
expect_grep "8 the tester gets the new log" "Repair round 1" "$WORK/eight.prompts/test-UC-001.log"
expect_grep "8 the fix station may not repair tests" "A separate session repairs the tests" "$WORK/eight.prompts/fix-UC-001.log"
for station in implement test fix; do
  expect_grep "8 spec diff in the $station prompt" "^-1. The old step that is removed." "$WORK/eight.prompts/$station-UC-001.log"
done
expect_eq "8 one row in the report" "$(grep -c '^| UC-001 |' "$R/.werkstatt/report.md")" 1
expect_grep "8 report row" "| UC-001 | \*\*ready\*\* | Approved -> Tested |" "$R/.werkstatt/report.md"
expect_eq "8 working tree clean" "$(cd "$R" && git status --porcelain)" ""

# ---------------------------------------------------------------- 9. the lint itself fails
R="$WORK/nine"; fixture "$R"
change "$R" "$WORK/nine.log" FAKE_LINT_RC=2
expect_grep "9 outcome" "^outcome=stuck$" "$R.output"
expect_eq "9 UC-001 outcome" "$(outcome_of "$R" UC-001)" stuck
expect_grep "9 UC-001 reason" "spec_lint.py failed for UC-001 (exit 2)" "$R/.werkstatt/UC-001/summary.json"
expect_no_file "9 nothing built" "$R/src/main/UC001.java"
expect_eq "9 UC-002 outcome" "$(outcome_of "$R" UC-002)" pending

# ---------------------------------------------------------------- 10. a question the lint rejects
R="$WORK/ten"; fixture "$R"
change "$R" "$WORK/ten.log" FAKE_BADQ=UC-001
expect_grep "10 outcome" "^outcome=blocked$" "$R.output"
expect_eq "10 UC-001 outcome" "$(outcome_of "$R" UC-001)" blocked
expect_grep "10 UC-001 reason" "has errors after the implement station of UC-001" "$R/.werkstatt/UC-001/summary.json"
expect_eq "10 UC-001 status" "$(status_of "$R" UC-001)" Approved
expect_no_file "10 UC-001 code dropped" "$R/src/main/UC001.java"
expect_grep "10 the question stays" "Yes (decides the result)" "$R/docs/open_questions.md"
expect_grep "10 the lint output in the report" "OQ_INVALID" "$R/.werkstatt/report.md"
expect_eq "10 working tree clean" "$(cd "$R" && git status --porcelain)" ""

if [ "$FAILURES" -gt 0 ]; then
  echo "--- run logs"; tail -n 30 "$WORK"/*.log
  exit 1
fi
echo "self-test passed"
