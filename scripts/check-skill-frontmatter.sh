#!/usr/bin/env bash
# Verify the front matter of every SKILL.md against the limits of the Agent Skills spec that the
# Tessl registry enforces on publish: `name` matches the skill folder, has at most 64 characters of
# lowercase letters, digits, and hyphens; `description` is present and has at most 1024 characters.
#
# A publish that breaks one of these limits fails only in the publish workflow after the merge, and
# the registry keeps serving the previous version (aiup-core stayed at 2.6.0 from 2.7.0 to 2.16.0
# because of a 1301-character description). This check fails the pull request instead.
set -euo pipefail

cd "$(dirname "$0")/.."

python3 - <<'EOF'
import glob, os, re, sys

MAX_NAME, MAX_DESCRIPTION = 64, 1024
errors = 0

def error(message):
    global errors
    print(f"ERROR: {message}", file=sys.stderr)
    errors += 1

def field(front_matter, key):
    """Returns a top-level scalar, folding `>` and `|` block scalars and stripping quotes."""
    lines = front_matter.splitlines()
    for i, line in enumerate(lines):
        match = re.match(rf"^{key}:\s*(.*)$", line)
        if not match:
            continue
        value = match.group(1).strip()
        if value[:1] in (">", "|"):
            block = []
            for next_line in lines[i + 1:]:
                if next_line and not next_line[0].isspace():
                    break
                block.append(next_line.strip())
            joiner = " " if value[0] == ">" else "\n"
            return joiner.join(part for part in block if part).strip()
        return value.strip("'\"")
    return None

skills = sorted(glob.glob("aiup-*/skills/*/SKILL.md"))
for path in skills:
    text = open(path, encoding="utf-8").read()
    match = re.match(r"^---\n(.*?)\n---\n", text, re.S)
    if not match:
        error(f"{path}: no YAML front matter")
        continue
    folder = os.path.basename(os.path.dirname(path))

    name = field(match.group(1), "name")
    if not name:
        error(f"{path}: front matter has no name")
    else:
        if name != folder:
            error(f"{path}: name '{name}' does not match its folder '{folder}'")
        if len(name) > MAX_NAME or not re.fullmatch(r"[a-z0-9]+(-[a-z0-9]+)*", name):
            error(f"{path}: name '{name}' must be at most {MAX_NAME} lowercase letters, digits, and hyphens")

    description = field(match.group(1), "description")
    if not description:
        error(f"{path}: front matter has no description")
    elif len(description) > MAX_DESCRIPTION:
        error(f"{path}: description has {len(description)} characters, at most {MAX_DESCRIPTION} are allowed")

if errors:
    sys.exit(1)
print(f"OK: every SKILL.md front matter is within the Agent Skills limits ({len(skills)} skills checked)")
EOF
