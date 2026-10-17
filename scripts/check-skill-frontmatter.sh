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

def fold(parts):
    """YAML line folding: lines join with a space, an empty line becomes a line break."""
    out = ""
    for part in parts:
        if not part:
            out += "\n"
        elif not out or out.endswith("\n"):
            out += part
        else:
            out += " " + part
    return out.strip()

def field(front_matter, key):
    """Returns a top-level scalar: plain, single- or double-quoted, or a `>`/`|` block scalar.

    Plain and quoted scalars may continue on indented lines (a long description wrapped by an editor); those are
    folded with spaces like YAML does, so a wrapped 1250-character description is measured in full."""
    lines = front_matter.splitlines()
    for i, line in enumerate(lines):
        match = re.match(rf"^{re.escape(key)}:(?:\s+(.*))?$", line)
        if not match:
            continue
        value = (match.group(1) or "").strip()
        continuation = []
        for next_line in lines[i + 1:]:
            if next_line.strip() and not next_line[0].isspace():
                break
            continuation.append(next_line)
        while continuation and not continuation[-1].strip():
            continuation.pop()
        if re.match(r"^[>|][0-9+-]*(\s+#.*)?$", value):
            block = [part.strip() for part in continuation]
            if value[0] == ">":
                return fold(block)
            return "\n".join(block).strip()
        if value[:1] in ("'", '"'):
            quote = value[0]
            text = fold([value[1:]] + [part.strip() for part in continuation])
            if quote == '"':
                body, escaped = [], False
                for ch in text:
                    if escaped:
                        body.append(ch)
                        escaped = False
                    elif ch == "\\":
                        escaped = True
                    elif ch == '"':
                        break
                    else:
                        body.append(ch)
                return "".join(body).strip()
            body = re.match(r"^((?:[^']|'')*)'?", text).group(1)
            return body.replace("''", "'").strip()
        value = re.sub(r"\s+#.*$", "", value)
        return fold([value] + [part.strip() for part in continuation])
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
