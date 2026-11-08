#!/usr/bin/env bash
# Verify that the Werkstatt stub agrees with the reusable workflow it calls.
#
# pipelines/werkstatt/aiup-werkstatt-stub.yml is the single source of the stub a project repository carries as
# .github/workflows/aiup-werkstatt.yml; the Studio ships a verbatim copy (docs/werkstatt.md). This check fails when the
# stub calls another workflow than .github/workflows/aiup-werkstatt.yml, when its engine_ref names another ref than
# its `uses:` line, when it passes an input the reusable workflow does not declare, or when it leaves out an input or
# a secret the reusable workflow declares - a stub that drifts here breaks every project that copies it.
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

if errors:
    print("\n".join(errors))
    sys.exit(1)
print(f"{STUB} agrees with {WORKFLOW}: {len(passed_inputs)} inputs, {len(passed_secrets)} secrets")
PY
