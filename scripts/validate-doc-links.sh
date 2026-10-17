#!/usr/bin/env bash
# Validate navigation links in the public marketplace documentation.
#
# Skill references and templates are intentionally outside this check: some contain example links whose base is the
# generated project document rather than the SKILL.md source file and therefore need source-aware validation.
set -euo pipefail

cd "$(dirname "$0")/.."

fail=0
error() {
  echo "ERROR: $1" >&2
  fail=$((fail + 1))
}

# No mapfile: macOS ships bash 3. One path per line, so a name with a space stays one path.
while IFS= read -r file; do
  while IFS= read -r -d '' line_number && IFS= read -r -d '' target; do
    case "$target" in
      http://*|https://*|mailto:*|\#*) continue ;;
    esac

    path=${target%%#*}
    [ -n "$path" ] || continue

    if [ ! -e "$(dirname "$file")/$path" ]; then
      error "$file:$line_number: broken relative link: $target"
    fi
  done < <(perl -ne 'while (/\[[^\]]*\]\(([^)]+)\)/g) { print "$.", "\0", $1, "\0" }' "$file")
done < <(find docs -type f -name '*.md' -print | sort; printf '%s\n' README.md aiup-*/README.md)

[ "$fail" -eq 0 ]
