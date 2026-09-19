#!/usr/bin/env bash
# Verify that every file reference in a SKILL.md stays inside its own skill folder.
#
# Hosts other than the Claude Code marketplace install skills one folder at a time: Tessl symlinks
# each skill to `.github/skills/tessl__<skill>` (or `.claude/skills/`, `.codex/skills/`, ...), and
# manual installs copy single skill folders. The agent then sees only that folder, so a link such
# as `../implement/references/project-layout.md` or `../../rules/mcp-servers.md` resolves to a path
# that does not exist. Files in other skills or at plugin level (`rules/`, `agents/`) must be named
# by a glob in prose (see CLAUDE.md, "Skill file references"), never linked with `../`.
#
# Fenced code blocks and inline code spans are ignored: they may hold example links whose base is
# the generated project document rather than the SKILL.md source file.
set -euo pipefail

cd "$(dirname "$0")/.."

fail=0
error() {
  echo "ERROR: $1" >&2
  fail=$((fail + 1))
}

files=()
while IFS= read -r f; do files+=("$f"); done < <(find aiup-*/skills -mindepth 2 -maxdepth 2 -name SKILL.md -print | sort)

for file in "${files[@]}"; do
  skill_dir=$(dirname "$file")
  while IFS= read -r -d '' line_number && IFS= read -r -d '' target; do
    case "$target" in
      http://*|https://*|mailto:*|\#*) continue ;;
    esac

    path=${target%%#*}
    [ -n "$path" ] || continue

    case "$path" in
      /*|../*|*/../*)
        error "$file:$line_number: link leaves the skill folder: $target (name the file and a glob instead)"
        continue
        ;;
    esac

    if [ ! -e "$skill_dir/$path" ]; then
      error "$file:$line_number: broken link inside the skill folder: $target"
    fi
  done < <(perl -ne '
    if (/^\s*(```|~~~)/) { $in_fence = !$in_fence; next }
    next if $in_fence;
    s/`[^`]*`//g;
    while (/\[[^\]]*\]\(([^)\s]+)\)/g) { print "$.", "\0", $1, "\0" }
  ' "$file")
done

if [ "$fail" -ne 0 ]; then
  echo "$fail skill link problem(s) found." >&2
  exit 1
fi

echo "OK: every SKILL.md link stays inside its skill folder and resolves (${#files[@]} skills checked)"
