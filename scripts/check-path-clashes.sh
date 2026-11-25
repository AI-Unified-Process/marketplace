#!/usr/bin/env bash
# Verify that no two tracked paths clash on Windows or macOS.
#
# The Claude plugin directory refuses a submission when two file or folder names differ only by letter case, Unicode
# form, or a trailing dot or space, because a checkout on a case-insensitive or normalizing file system would merge
# them (evals/aiup-jpa once had no-dto-DTO.md next to no-dto-Dto.md). It also refuses names that look like a Windows
# short name (PROGRA~1). This check reads `git ls-files`, so it sees exactly what a clone would hold.
set -euo pipefail

cd "$(dirname "$0")/.."

git -c core.quotePath=false ls-files -z | python3 -c '
import collections, re, sys, unicodedata

paths = [p for p in sys.stdin.buffer.read().decode("utf-8").split("\0") if p]
names = set()
for path in paths:
    parts = path.split("/")
    for i in range(1, len(parts) + 1):
        names.add("/".join(parts[:i]))

groups = collections.defaultdict(set)
errors = []
for name in names:
    key = "/".join(unicodedata.normalize("NFC", part).casefold().rstrip(". ") for part in name.split("/"))
    groups[key].add(name)
    base = name.rsplit("/", 1)[-1]
    if base != base.rstrip(". "):
        errors.append(f"{name}: ends with a dot or a space")
    if re.search(r"~\d", base):
        errors.append(f"{name}: looks like a Windows short name")

for group in groups.values():
    if len(group) > 1:
        errors.append("clash: " + " <-> ".join(sorted(group)))

for error in sorted(errors):
    print(f"ERROR: {error}", file=sys.stderr)
if errors:
    sys.exit(1)
print(f"OK: {len(names)} paths, no clashes")
'
