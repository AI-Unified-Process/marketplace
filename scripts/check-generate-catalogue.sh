#!/usr/bin/env bash
# Verify that the two shared implementations of the generate workflow agree with each other and with the skills on disk.
#
# The reusable GitHub workflow (.github/workflows/aiup-generate.yml) and the Bitbucket script (pipelines/aiup-generate.sh)
# mirror each other (docs/generate-workflow-versioning.md): the catalogue of allowed plugin/skill pairs, the skills whose
# run gets the specification diff or advances the status, and the plugin selection block are the same in both. A skill
# added to a plugin but not to the catalogue can never be run from the Studio, and one that is renamed leaves a dead
# entry behind; neither fails anywhere else. Every skill on disk is either in the catalogue or listed below as one that
# is deliberately left out.
set -euo pipefail

cd "$(dirname "$0")/.."

python3 - <<'PY'
import glob, os, re, sys

WORKFLOW = ".github/workflows/aiup-generate.yml"
SCRIPT = "pipelines/aiup-generate.sh"
# Skills the Studio never runs: read-only audits (a run that changes nothing has no result to propose), the question
# log (recording and answering need a person; spec_lint.py --report gives the overview), the architecture decisions
# (a decision needs a person), and the legacy Karibu test skill, superseded by browserless-test.
LEFT_OUT = {
    "aiup-core/spec-review", "aiup-core/use-case-coverage", "aiup-core/test-case-coverage",
    "aiup-core/open-questions", "aiup-core/architecture-decision", "aiup-vaadin-jooq/coverage-check", "aiup-angular-jpa/coverage-check", "aiup-vaadin-jooq/karibu-test",
}
NOT_LAYER = {"aiup-core", "aiup-vaadin-jooq", "aiup-angular-jpa", "aiup-blazor-dotnet", "aiup-nestjs-nextjs"}
errors = 0


def error(message):
    global errors
    print(f"ERROR: {message}", file=sys.stderr)
    errors += 1


def catalogue(text):
    return re.findall(r"^\s*(aiup-[a-z0-9-]+/[a-z0-9-]+)\) ;;\s*$", text, re.M)


def skill_cases(text):
    """The patterns of every `case "$SKILL" in` block, in order, as sorted skill lists."""
    arms = []
    for block in re.findall(r'case "\$SKILL" in\n(.*?)\n\s*esac', text, re.S):
        body = "\n".join(re.sub(r"#.*", "", line) for line in block.splitlines())
        body = body.replace("\\\n", " ")
        for match in re.finditer(r"^\s*([a-z0-9-]+(?:\s*\|\s*[a-z0-9-]+)*)\s*\)", body, re.M):
            arms.append(sorted(re.split(r"\s*\|\s*", match.group(1).strip())))
    return arms


def selection(text):
    match = re.search(r"^[ \t]*# >>> plugin selection.*?^[ \t]*# <<< plugin selection", text, re.S | re.M)
    if not match:
        return None
    return [line.strip() for line in match.group(0).splitlines()]


workflow = open(WORKFLOW, encoding="utf-8").read()
script = open(SCRIPT, encoding="utf-8").read()

listed = catalogue(script)
if catalogue(workflow) != listed:
    only_workflow = sorted(set(catalogue(workflow)) - set(listed))
    only_script = sorted(set(listed) - set(catalogue(workflow)))
    error(f"the catalogues differ (only in {WORKFLOW}: {only_workflow or 'none'}; only in {SCRIPT}: "
          f"{only_script or 'none'}; or the order differs)")
for entry, count in ((e, listed.count(e)) for e in set(listed)):
    if count > 1:
        error(f"{SCRIPT}: catalogue lists {entry} {count} times")

if skill_cases(workflow) != skill_cases(script):
    error(f'the `case "$SKILL"` lists (specification diff, status advance) differ between {WORKFLOW} and {SCRIPT}')

on_disk = {"/".join(p.split("/")[0:3:2]) for p in glob.glob("aiup-*/skills/*/SKILL.md")}
for entry in sorted(set(listed)):
    if entry not in on_disk:
        error(f"catalogue entry {entry} has no {entry.split('/')[0]}/skills/{entry.split('/')[1]}/SKILL.md")
for entry in sorted(on_disk - set(listed) - LEFT_OUT):
    error(f"{entry} is not in the catalogue of {SCRIPT}; add it there and to {WORKFLOW} (or to LEFT_OUT of this "
          f"script)")
for entry in sorted(LEFT_OUT & set(listed)):
    error(f"{entry} is in the catalogue and in LEFT_OUT of this script")

block = selection(script)
if block is None or selection(workflow) is None:
    error("the plugin selection block (# >>> plugin selection ... # <<< plugin selection) is missing")
elif selection(workflow) != block:
    error(f"the plugin selection block differs between {WORKFLOW} and {SCRIPT}")
else:
    text = "\n".join(block)
    mapping = re.search(r'layer_skills="(.*?)"', text, re.S)
    pairs = {tuple(p.split(":")) for p in mapping.group(1).split()} if mapping else set()
    layer_plugins = {os.path.dirname(p) for p in glob.glob("aiup-*/plugin.json")} - NOT_LAYER
    for plugin, skill in sorted(pairs):
        if plugin not in layer_plugins or not os.path.isfile(f"{plugin}/skills/{skill}/SKILL.md"):
            error(f"plugin selection: {plugin}:{skill} is not a skill of a layer plugin")
    for entry in sorted(e for e in on_disk if e.split("/")[0] in layer_plugins):
        if tuple(entry.split("/")) not in pairs:
            error(f"plugin selection: layer_skills lacks {entry.replace('/', ':')}")
    combined = set(re.findall(r"(aiup-[a-z0-9-]+)/\*", text)) - {"aiup-core"}
    if combined != NOT_LAYER - {"aiup-core"}:
        error(f"plugin selection: the combined stack plugins are {sorted(combined)}, expected "
              f"{sorted(NOT_LAYER - {'aiup-core'})}")

if errors:
    sys.exit(1)
print(f"generate catalogue consistent: {len(listed)} plugin/skill pairs, identical in both implementations")
PY
