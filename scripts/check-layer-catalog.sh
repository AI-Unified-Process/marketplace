#!/usr/bin/env bash
# Verify that the layer plugins describe themselves consistently.
#
# Every layer skill that builds a layer, and every end-to-end test skill (which has no build skill), ships a
# references/layer.md with one row of the layer catalog. /architecture discovers the installed layer skills by
# globbing for these files, so a row that names the wrong plugin, a missing folder, or an unknown "Tests run" value
# breaks the Layers table it writes and the integration layer /use-case-test runs from. The Plugins table of
# aiup-core/skills/architecture/references/layer-catalog.md is the list /architecture suggests plugins from; it must
# name exactly the skills the layer.md files describe, each once. When the Plugins table carries a "Tests run" column,
# each row's value must equal the layer.md's, so a test skill that switches from the real database to a mocked
# backend (which moves the integration layer) cannot change one side only. Every plugin directory except aiup-core and
# the combined stack plugins is a layer plugin: each of its skills must be described by a layer.md row.
set -euo pipefail

cd "$(dirname "$0")/.."

python3 - <<'PY'
import collections, glob, os, re, sys

CATALOG = "aiup-core/skills/architecture/references/layer-catalog.md"
# Every skill of a layer plugin builds or tests a layer and must appear in a layer.md row. The layer plugins are derived,
# so a new plugin without a layer.md fails here instead of being skipped.
NOT_LAYER = {"aiup-core", "aiup-vaadin-jooq", "aiup-angular-jpa", "aiup-blazor-dotnet", "aiup-nestjs-nextjs"}
LAYER_PLUGINS = sorted(os.path.dirname(p) for p in glob.glob("aiup-*/plugin.json")
                       if os.path.dirname(p) not in NOT_LAYER)
LAYERS = {"Migration", "Persistence", "Service", "API", "UI", "E2E"}
TESTS_RUN = {"–", "in process, real database", "backend mocked", "running application"}
errors = 0

def error(message):
    global errors
    print(f"ERROR: {message}", file=sys.stderr)
    errors += 1

def cells(line):
    return [c.strip().strip("`") for c in line.strip().strip("|").split("|")]

def table(text, header_start):
    """(header, rows) of the first table whose header begins with header_start."""
    lines = text.splitlines()
    for i, line in enumerate(lines):
        if line.startswith("|") and cells(line)[0] == header_start:
            rows = []
            for row in lines[i + 2:]:
                if not row.startswith("|"):
                    break
                rows.append(cells(row))
            return cells(line), rows
    return None, None

def data_rows(text, header_start):
    return table(text, header_start)[1]

described = set()
tests_run = {}
for path in sorted(glob.glob("aiup-*/skills/*/references/layer.md")):
    plugin = path.split("/")[0]
    folder = path.split("/")[2]
    rows = data_rows(open(path, encoding="utf-8").read(), "Plugin")
    if not rows or len(rows) != 1 or len(rows[0]) != 6:
        error(f"{path}: expected exactly one row of six columns")
        continue
    row_plugin, layer, skill, test, run, detect = rows[0]
    if row_plugin != plugin:
        error(f"{path}: Plugin column {row_plugin} is not the plugin {plugin}")
    if layer not in LAYERS:
        error(f"{path}: unknown layer {layer}")
    if run not in TESTS_RUN:
        error(f"{path}: unknown Tests run value {run!r}")
    if (test == "–") != (run == "–"):
        error(f"{path}: Tests run must be – exactly when there is no test skill")
    if (layer == "E2E") != (run == "running application"):
        error(f"{path}: Tests run is 'running application' exactly for an E2E row, not {run!r} for {layer}")
    if skill != "–" and skill != folder:
        error(f"{path}: Skill column {skill} is not the skill folder {folder}")
    if skill == "–" and test != folder:
        error(f"{path}: a row without a build skill belongs to its test skill folder, not {folder}")
    for name in (skill, test):
        if name != "–" and not os.path.isfile(f"{plugin}/skills/{name}/SKILL.md"):
            error(f"{path}: {plugin}/skills/{name}/SKILL.md does not exist")
    if not detect:
        error(f"{path}: the Detect column is empty")
    described.add((plugin, layer, skill, test))
    tests_run[(plugin, layer, skill, test)] = run

for plugin in LAYER_PLUGINS:
    skills = sorted(glob.glob(f"{plugin}/skills/*/SKILL.md"))
    if not skills:
        error(f"{plugin}: layer plugin has no skills")
    if not glob.glob(f"{plugin}/skills/*/references/layer.md"):
        error(f"{plugin}: layer plugin has no skills/*/references/layer.md (core and the combined stack plugins are "
              "listed in NOT_LAYER of scripts/check-layer-catalog.sh)")
    for path in skills:
        folder = path.split("/")[2]
        if not any(folder in (s, t) for p, _, s, t in described if p == plugin):
            error(f"{path}: layer skill is in no references/layer.md row")

header, rows = table(open(CATALOG, encoding="utf-8").read(), "Plugin")
if not rows:
    error(f"{CATALOG}: no Plugins table")
    rows = []
for row, count in collections.Counter(tuple(r[:4]) for r in rows).items():
    if count > 1:
        error(f"{CATALOG}: Plugins table lists {' | '.join(row)} {count} times")
listed = {tuple(r[:4]) for r in rows}
if header and "Tests run" in header:
    column = header.index("Tests run")
    for r in rows:
        key = tuple(r[:4])
        if key in tests_run and (len(r) <= column or r[column] != tests_run[key]):
            error(f"{CATALOG}: Tests run of {' | '.join(key)} is {r[column] if len(r) > column else None!r}, "
                  f"its references/layer.md says {tests_run[key]!r}")
for missing in sorted(described - listed):
    error(f"{CATALOG}: Plugins table lacks {' | '.join(missing)}")
for extra in sorted(listed - described):
    error(f"{CATALOG}: Plugins table row {' | '.join(extra)} has no matching references/layer.md")

if errors:
    sys.exit(1)
print(f"layer catalog consistent: {len(described)} layer.md rows")
PY
