#!/usr/bin/env bash
#
# Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
# Part of the AI Unified Process — https://unifiedprocess.ai
# Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
#
# AI Unified Process Werkstatt - runs the stations on your own machine instead of a GitHub runner.
#
# Run it from the project's checkout, on the change branch. It builds the committed state of that branch in a new Git
# worktree, on a new branch aiup/werkstatt-local-<stamp>; the checkout you work in is never touched, because a blocked
# or stuck use case resets and cleans the tree it runs in. The result is the commits on that branch and the report in
# <worktree>/.werkstatt/report.md; no pull request is opened. Review the branch, then merge it or push it and open the
# pull request yourself.
#
# Differences from the GitHub run, which the script asks you to accept unless --yes is given:
#   - The stations run `claude -p --permission-mode bypassPermissions` as you, with your files, credentials and
#     network, not on a throwaway runner. Only `git` is denied to them.
#   - Without `setsid --wait` (macOS), the stations of a use case share your session: a build daemon or a dev server
#     they leave behind is not killed and may write into the worktree after the use case ended.
#   - The stations use your Claude Code login, CLI version, installed plugins, and ~/.claude settings, not the pinned
#     CLI and a fresh plugin install. The helpers come from this marketplace checkout.
#
# Usage: run-local.sh [--yes] [UC-001 UC-002 ...]
#   Without ids: the Approved use cases whose specification changed against the merge base with the default branch,
#   as in the GitHub run (select-ucs.sh). Ids given by hand run in id order, each once; one not Approved is skipped.
# Env: DEFAULT_BRANCH (default: origin's HEAD, else main), WORKTREE (default: <checkout>-werkstatt-<stamp> next to the
#      checkout), TIMEOUT_MINUTES (optional: the stations stop then and the use case still running ends stuck),
#      SPEC_LINT (default: spec_lint.py of the installed aiup-core), and the limits of run-uc.sh: MODEL, MAX_TURNS,
#      MAX_ROUNDS, MAX_COST_USD (per use case), STACK_PLUGIN (a combined stack plugin; empty for layer plugins),
#      ARTIFACT_LOCATIONS.
set -uo pipefail

ENGINE=$(cd "$(dirname "$0")/../.." && pwd)
export ENGINE

die() { echo "run-local: $*" >&2; exit 1; }

yes=0
ids=""
for arg in "$@"; do
  case "$arg" in
    --yes|-y) yes=1 ;;
    -h|--help) sed -n '7,30p' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
    UC-[0-9]*) ids="$ids $arg" ;;
    *) die "unknown argument '$arg' (expected --yes or use case ids such as UC-003)" ;;
  esac
done

for tool in git python3 jq claude; do
  command -v "$tool" >/dev/null 2>&1 || die "$tool is not on the PATH"
done

top=$(git rev-parse --show-toplevel 2>/dev/null) || die "run it from the project's Git checkout"
cd "$top" || exit 1
branch=$(git symbolic-ref -q --short HEAD) || die "HEAD is detached; check out the change branch"

if [ -z "${DEFAULT_BRANCH:-}" ]; then
  DEFAULT_BRANCH=$(git symbolic-ref -q --short refs/remotes/origin/HEAD 2>/dev/null | sed 's|^origin/||')
  DEFAULT_BRANCH="${DEFAULT_BRANCH:-main}"
fi
export DEFAULT_BRANCH
[ "$branch" != "$DEFAULT_BRANCH" ] || die "the Werkstatt runs on a change branch, not on $DEFAULT_BRANCH"

# The worktree is built from the last commit: an uncommitted specification change would silently not be built.
[ -z "$(git status --porcelain)" ] || die "the checkout has uncommitted changes; commit them first (the Werkstatt builds the committed state)"

if [ -n "${TIMEOUT_MINUTES:-}" ]; then
  case "$TIMEOUT_MINUTES" in ''|*[!0-9]*|0) die "TIMEOUT_MINUTES must be a whole number of minutes above 0, not '$TIMEOUT_MINUTES'" ;; esac
  # No pull request step follows here, so the stations may use the whole time.
  DEADLINE=$(( $(date +%s) + TIMEOUT_MINUTES * 60 ))
  export DEADLINE
fi

# Which use cases: the ids given, each once and in id order, or those of the change, as the GitHub run selects them.
if [ -n "$ids" ]; then
  # shellcheck disable=SC2086
  ucs=$(printf '%s\n' $ids | grep -oE '^UC-[0-9]+' | sort -u | sort -t- -k2,2n | paste -sd' ' -)
else
  git remote get-url origin >/dev/null 2>&1 && { git fetch -q origin "$DEFAULT_BRANCH" || echo "run-local: could not fetch origin/$DEFAULT_BRANCH; using the local copy" >&2; }
  git rev-parse -q --verify "refs/remotes/origin/$DEFAULT_BRANCH" >/dev/null \
    || die "origin/$DEFAULT_BRANCH is unknown, so the change cannot be found; name the use cases instead (run-local.sh UC-003)"
  ucs=$(bash "$ENGINE/pipelines/werkstatt/select-ucs.sh" "$ENGINE" "$DEFAULT_BRANCH") || die "select-ucs.sh failed"
fi
if [ -z "$ucs" ]; then
  echo "No Approved use case changed against $DEFAULT_BRANCH; nothing to build."
  exit 0
fi

if [ -z "${SPEC_LINT:-}" ]; then
  # The deterministic lint of /spec-review from the installed aiup-core, so it matches the skills the stations use.
  SPEC_LINT=$(find "$HOME/.claude/plugins" -path '*aiup-core*/skills/spec-review/scripts/spec_lint.py' 2>/dev/null | sort | tail -1)
  SPEC_LINT="${SPEC_LINT:-$ENGINE/aiup-core/skills/spec-review/scripts/spec_lint.py}"
fi
export SPEC_LINT

stamp=$(date +%Y%m%d-%H%M%S)
result_branch="aiup/werkstatt-local-$stamp"
WORKTREE="${WORKTREE:-$(dirname "$top")/$(basename "$top")-werkstatt-$stamp}"
[ ! -e "$WORKTREE" ] || die "$WORKTREE already exists"

cat <<EOF
AI Unified Process Werkstatt, local run
  use cases     $ucs
  from          $branch ($(git rev-parse --short HEAD)), default branch $DEFAULT_BRANCH
  worktree      $WORKTREE
  result branch $result_branch
  model         ${MODEL:-claude-opus-5-5}, at most \$${MAX_COST_USD:-15} per use case
  claude        $(claude --version 2>/dev/null | head -n 1) (the GitHub run pins 2.1.322)

The stations run Claude Code with --permission-mode bypassPermissions as you, on this machine:
they can read and change any file you can and reach the network. Only git is denied to them.
EOF
if ! { command -v setsid >/dev/null 2>&1 && setsid --help 2>&1 | grep -q -- '--wait'; }; then
  echo "This machine has no 'setsid --wait': a process a station leaves behind is not killed."
fi
if [ "$yes" -ne 1 ]; then
  [ -t 0 ] || die "not a terminal; pass --yes to accept the above"
  printf 'Continue? [y/N] '
  read -r answer
  case "$answer" in y|Y|yes|Yes) ;; *) echo "Nothing built."; exit 1 ;; esac
fi

git worktree add -q -b "$result_branch" "$WORKTREE" HEAD || die "could not create the worktree"
# The run records stay out of the commits, as in the GitHub run (info/exclude is shared by all worktrees).
common=$(git rev-parse --git-common-dir)
mkdir -p "$common/info"
grep -qxF '.werkstatt/' "$common/info/exclude" 2>/dev/null || printf '%s\n' '.werkstatt/' >> "$common/info/exclude"

cd "$WORKTREE" || exit 1
mkdir -p .werkstatt
export CORRELATION_ID="${CORRELATION_ID:-local-$stamp}"
export GITHUB_OUTPUT="$WORKTREE/.werkstatt/outputs"
# shellcheck disable=SC2086
bash "$ENGINE/pipelines/werkstatt/run-change.sh" $ucs
rc=$?

outcome=$(sed -n 's/^outcome=//p' "$GITHUB_OUTPUT" 2>/dev/null | tail -n 1)
commits=$(git rev-list --count "$branch..$result_branch" 2>/dev/null || echo 0)
cat <<EOF

Outcome: ${outcome:-unknown} (exit $rc), $commits commit(s) on $result_branch
Report:  $WORKTREE/.werkstatt/report.md

Next steps, from $top:
  git log --stat $branch..$result_branch          review the result
  git merge $result_branch                         take it over on $branch
  git push -u origin $result_branch && gh pr create --base $branch --head $result_branch --body-file "$WORKTREE/.werkstatt/report.md"
  git worktree remove --force "$WORKTREE" && git branch -D $result_branch     clean up afterwards
EOF
exit "$rc"
