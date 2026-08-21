#!/usr/bin/env bash
# Checks that every Markdown file carrying AI Unified Process intellectual property contains the
# copyright header. Apache-2.0 section 4(c) only obliges redistributors to retain
# notices that are actually present in the source files, so a skill copied on its
# own must carry one.
#
#   scripts/check-copyright-headers.sh          # verify (used by CI)
#   scripts/check-copyright-headers.sh --fix    # insert missing headers in place
#
# In files with YAML front matter the header is inserted directly after the closing
# `---`, so the front matter stays parseable. HTML comments render invisibly on
# GitHub and are ignored by skill loaders.
set -euo pipefail

cd "$(dirname "$0")/.."

COPYRIGHT_LINE='Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.'

read -r -d '' HEADER <<'EOF' || true
<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->
EOF

fix=0
[ "${1:-}" = "--fix" ] && fix=1

# Artifact templates and worked examples that skills copy into the user's own project.
# Stamping these would put an AI Unified Process copyright on documents the user authors, and the
# use-case-spec validator rejects any content before the title line.
EXCLUDED='
aiup-core/skills/use-case-spec/references/example.md
aiup-core/skills/use-case-spec/references/use-case.md
aiup-core/skills/test-case/references/example.md
aiup-core/skills/test-case/references/test-case.md
docs/templates/CLAUDE.md
docs/templates/vision.md
'

# Files that must carry the header: skill definitions and their agent-facing reference
# material, sub-agent definitions, the marketplace and plugin READMEs, and the published
# documentation.
targets() {
  {
    find aiup-*/skills -type f -name '*.md'
    find aiup-*/ -type f -name '*.md' -path '*/agents/*'
    find docs -type f -name '*.md'
    ls aiup-*/README.md README.md
  } | grep -vxF "$(echo "$EXCLUDED" | sed '/^$/d')"
}

missing=0
added=0

while IFS= read -r file; do
  if grep -qF "$COPYRIGHT_LINE" "$file"; then
    continue
  fi

  if [ "$fix" -eq 0 ]; then
    echo "ERROR: missing copyright header: $file" >&2
    missing=$((missing + 1))
    continue
  fi

  tmp=$(mktemp)
  if [ "$(head -n 1 "$file")" = "---" ]; then
    # Insert after the closing delimiter of the YAML front matter.
    end=$(awk 'NR > 1 && $0 == "---" { print NR; exit }' "$file")
    if [ -z "$end" ]; then
      echo "ERROR: unterminated front matter: $file" >&2
      rm -f "$tmp"
      missing=$((missing + 1))
      continue
    fi
    head -n "$end" "$file" >"$tmp"
    printf '\n%s\n' "$HEADER" >>"$tmp"
    tail -n +$((end + 1)) "$file" >>"$tmp"
  else
    printf '%s\n\n' "$HEADER" >"$tmp"
    cat "$file" >>"$tmp"
  fi
  mv "$tmp" "$file"
  echo "added header: $file"
  added=$((added + 1))
done < <(targets | sort -u)

if [ "$fix" -eq 1 ]; then
  echo "Headers added: $added"
fi

# `tessl plugin publish ./<plugin>` packages the plugin directory alone, so a
# root-level LICENSE/NOTICE would never reach the published artifact. Each plugin
# keeps its own byte-identical copy.
for dir in aiup-*/; do
  for f in LICENSE NOTICE; do
    if [ "$fix" -eq 1 ]; then
      cp "$f" "$dir$f"
      continue
    fi
    if [ ! -f "$dir$f" ]; then
      echo "ERROR: $dir$f is missing (published Tessl packages would lose it)" >&2
      missing=$((missing + 1))
    elif ! cmp -s "$f" "$dir$f"; then
      echo "ERROR: $dir$f differs from the repository root $f" >&2
      missing=$((missing + 1))
    fi
  done
done

[ "$missing" -eq 0 ] || {
  echo "Run 'scripts/check-copyright-headers.sh --fix' to repair." >&2
  exit 1
}

echo "OK: copyright headers, LICENSE and NOTICE present"
