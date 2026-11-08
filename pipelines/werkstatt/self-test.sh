#!/usr/bin/env bash
#
# Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
# Part of the AI Unified Process — https://unifiedprocess.ai
# Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
#
# AI Unified Process Werkstatt - runs the stations against a fixture repository with a fake `claude` on the PATH.
#
# No model, no network: the fake plays each station by writing files the way the skills would. Checked:
#   1. ready, blocked, pending: a green use case moves to Tested with its code, a blocked one keeps only its open
#      question, the next one is not built; the lane guard reverts test code of the implementer and production code
#      of the tester, and keeps the tester's build file.
#   2. the deadline: a use case still running is stopped and dropped, the one before it keeps its result.
#   3. a deadline already past: nothing is built, every use case is pending.
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
# Plays one Werkstatt station. FAKE_BLOCK and FAKE_SLEEP name the use cases that block or hang in the implementer.
prompt="$2"
uc=$(printf '%s' "$prompt" | grep -oE 'UC-[0-9]+' | head -1)
n=${uc#UC-}
case "$prompt" in
  *uc-coverage*)
    out=$(printf '%s' "$prompt" | grep -oE '\.werkstatt/UC-[0-9]+/coverage\.json' | head -1)
    echo '| Element | Code | Test |' > "${out%.json}.md"
    echo '{"complete": true, "code_gaps": [], "test_gaps": []}' > "$out"
    echo "audit scribble" > README.md   # the audit is read-only: the harness must undo this
    ;;
  *use-case-test*)
    mkdir -p src/test src/main
    echo "class UC${n}Test {}" > "src/test/UC${n}Test.java"
    echo "<project>test dependency $uc</project>" > pom.xml
    echo "// the tester may not change production code" >> "src/main/UC${n}.java"
    ;;
  *use-case-implement*)
    mkdir -p src/main src/test
    echo "class UC${n} {}" > "src/main/UC${n}.java"
    echo "class Sneaky${n}Test {}" > "src/test/Sneaky${n}Test.java"
    case " ${FAKE_BLOCK:-} " in *" $uc "*)
      printf '\n## OQ-0%s: Which rate?\n\n**Element:** %s BR-001\n**Blocking:** Yes\n**Status:** Open\n' \
        "$n" "$uc" >> docs/open_questions.md ;;
    esac
    case " ${FAKE_SLEEP:-} " in *" $uc "*) sleep 300 ;; esac
    ;;
esac
echo '{"total_cost_usd": 0.25}'
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
      printf '# UC-%s: Case %s\n\n**Status:** Approved\n' "$n" "$n" > "docs/use_cases/UC-$n-case.md"
    done
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
      GITHUB_OUTPUT="$dir.output" "$@" \
      bash "$ENGINE/pipelines/werkstatt/run-change.sh" UC-001 UC-002 UC-003 > "$log" 2>&1)
}

outcome_of() { jq -r .outcome "$1/.werkstatt/$2/summary.json" 2>/dev/null; }
status_of() { sed -n 's/^\*\*Status:\*\* *//p' "$1/docs/use_cases/$2-case.md"; }

# ---------------------------------------------------------------- 1. ready, blocked, pending
R="$WORK/one"; fixture "$R"
change "$R" "$WORK/one.log" FAKE_BLOCK=UC-002
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

if [ "$FAILURES" -gt 0 ]; then
  echo "--- run logs"; tail -n 30 "$WORK"/*.log
  exit 1
fi
echo "self-test passed"
