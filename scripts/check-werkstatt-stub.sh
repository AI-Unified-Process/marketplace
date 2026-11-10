#!/usr/bin/env bash
# Verify that the Werkstatt stub agrees with the reusable workflow it calls.
#
# pipelines/werkstatt/aiup-werkstatt-stub.yml is the single source of the stub a project repository carries as
# .github/workflows/aiup-werkstatt.yml; the Studio ships a verbatim copy (docs/werkstatt.md). This check fails when the
# stub calls another workflow than .github/workflows/aiup-werkstatt.yml, when its engine_ref names another ref than
# its `uses:` line, when it passes an input the reusable workflow does not declare, when it leaves out an input or
# a secret the reusable workflow declares, when it does not forward a dispatch input to the workflow input of the same
# name (a typo there silently runs with the workflow's default), when a dispatch input is forwarded nowhere, or when a
# default of the stub differs from the default of the reusable workflow (the documented default would then not be
# the one a dispatched run gets) - a stub that drifts here breaks every project that copies it.
set -euo pipefail

cd "$(dirname "$0")/.."

python3 - <<'PY'
import re, sys

STUB = "pipelines/werkstatt/aiup-werkstatt-stub.yml"
WORKFLOW = ".github/workflows/aiup-werkstatt.yml"


def block(text, header, indent):
    """The keys directly below `header` at the given indentation, up to the next line indented less."""
    lines = text.splitlines()
    for i, line in enumerate(lines):
        if line.strip() == header and len(line) - len(line.lstrip()) == indent - 2:
            keys = []
            for following in lines[i + 1:]:
                if not following.strip() or following.lstrip().startswith("#"):
                    continue
                depth = len(following) - len(following.lstrip())
                if depth < indent:
                    break
                if depth == indent:
                    keys.append(following.strip().split(":", 1)[0])
            return keys
    return None


def entries(text, header, indent):
    """{key: value} of the lines directly below `header` at the given indentation (value '' for a nested block)."""
    lines, found = text.splitlines(), {}
    for i, line in enumerate(lines):
        if line.strip() == header and len(line) - len(line.lstrip()) == indent - 2:
            for following in lines[i + 1:]:
                if not following.strip() or following.lstrip().startswith("#"):
                    continue
                depth = len(following) - len(following.lstrip())
                if depth < indent:
                    break
                if depth == indent:
                    key, _, value = following.strip().partition(":")
                    found[key] = value.strip()
            break
    return found


def defaults(text, header, indent):
    """{input: default} of the inputs declared below `header`; an input without a default is left out."""
    lines, found, name, inside = text.splitlines(), {}, None, False
    for line in lines:
        depth = len(line) - len(line.lstrip())
        if line.strip() == header and depth == indent - 2:
            inside = True
            continue
        if not inside or not line.strip() or line.lstrip().startswith("#"):
            continue
        if depth < indent:
            break
        if depth == indent:
            name = line.strip().rstrip(":")
        elif depth == indent + 2 and line.strip().startswith("default:"):
            found[name] = line.strip()[len("default:"):].strip().strip('"\'')
    return found


stub = open(STUB, encoding="utf-8").read()
workflow = open(WORKFLOW, encoding="utf-8").read()
errors = []

uses = re.search(r"^\s*uses:\s*(\S+)@(\S+)\s*$", stub, re.M)
engine_ref = re.search(r"^\s*engine_ref:\s*(\S+)\s*$", stub, re.M)
if not uses:
    errors.append(f"{STUB}: no `uses:` line")
else:
    if uses.group(1).lower() != ("ai-unified-process/marketplace/" + WORKFLOW).lower():
        errors.append(f"{STUB}: calls {uses.group(1)}, not {WORKFLOW} of this marketplace")
    if not engine_ref or engine_ref.group(1) != uses.group(2):
        errors.append(f"{STUB}: engine_ref must name the ref of the `uses:` line ({uses.group(2)})")

declared_inputs = block(workflow, "inputs:", 6) or []
declared_secrets = block(workflow, "secrets:", 6) or []
passed_inputs = block(stub, "with:", 6) or []
passed_secrets = block(stub, "secrets:", 6) or []

for name in passed_inputs:
    if name not in declared_inputs:
        errors.append(f"{STUB}: passes input `{name}`, which {WORKFLOW} does not declare")
for name in declared_inputs:
    if name not in passed_inputs:
        errors.append(f"{STUB}: does not pass input `{name}` of {WORKFLOW}")
for name in declared_secrets:
    if name not in passed_secrets:
        errors.append(f"{STUB}: does not pass secret `{name}` of {WORKFLOW}")

# Forwarding: `name: ${{ inputs.name }}` for every dispatch input, a literal only for engine_ref (checked above).
dispatch_inputs = block(stub, "inputs:", 6) or []
forwarded = entries(stub, "with:", 6)
for name, value in forwarded.items():
    if name == "engine_ref":
        continue
    source = re.fullmatch(r"\$\{\{\s*(?:github\.event\.)?inputs\.([A-Za-z0-9_]+)\s*\}\}", value)
    if not source:
        errors.append(f"{STUB}: `{name}` is not forwarded from a dispatch input ({value or 'no value'})")
    elif source.group(1) != name:
        errors.append(f"{STUB}: `{name}` is forwarded from `inputs.{source.group(1)}`, not from `inputs.{name}`")
    elif name not in dispatch_inputs:
        errors.append(f"{STUB}: forwards `inputs.{name}`, which its workflow_dispatch does not declare")
for name in dispatch_inputs:
    if name not in forwarded:
        errors.append(f"{STUB}: declares the dispatch input `{name}` but does not pass it on")
for name, value in sorted(entries(stub, "secrets:", 6).items()):
    if value != "${{ secrets." + name + " }}":
        errors.append(f"{STUB}: secret `{name}` is not passed as `${{{{ secrets.{name} }}}}` ({value})")

# Defaults: what a dispatched run gets is the stub's default, so the two must say the same.
stub_defaults = defaults(stub, "inputs:", 6)
workflow_defaults = defaults(workflow, "inputs:", 6)
for name in sorted(set(stub_defaults) & set(workflow_defaults)):
    if stub_defaults[name] != workflow_defaults[name]:
        errors.append(f"default of `{name}`: {STUB} says `{stub_defaults[name]}`, {WORKFLOW} says "
                      f"`{workflow_defaults[name]}`")

if errors:
    print("\n".join(errors))
    sys.exit(1)
print(f"{STUB} agrees with {WORKFLOW}: {len(passed_inputs)} inputs, {len(passed_secrets)} secrets, "
      f"{len(set(stub_defaults) & set(workflow_defaults))} defaults")
PY
