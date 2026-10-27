#!/usr/bin/env python3
"""Keep the seeded stack files of the eval scenarios in step with the stack template and the layer skills.

A scenario seeds its project with docs/architecture/stack.md. The layer-skill fixtures are exact copies
(sync-eval-fixtures.sh), but a seeded stack file is project content written for the scenario, and it ages: an old
header, no **E2E scope:** line, marker rows from an older markers reference (#58). The orchestrators and the coverage
agent then read a format users no longer have. This script owns the parts of a seeded stack file that the template
and the layer skills dictate, and leaves the scenario's own content (layers, module layout, API contract, commands)
alone:

- the header up to **Last updated:**, the explanation under the Integration layer table, the explanation under the
  **E2E scope:** line, the intro of ## Markers, and the All row: as in aiup-core/skills/stack/references/stack.md;
- the **E2E scope:** line: present exactly when the E2E layer is; a missing one is added as `Use cases and test
  cases`, which is how the skills read a stack file without the line, so the scenario's behaviour does not change;
- the marker rows of each layer skill that has rows: exactly the rows of its references/markers.md, in that order.
  Skills without rows stay without: a scenario may expect a skill to add them. The rows of the skill a layer-plugin
  scenario tests (its folder name starts with the skill name) are not touched, because the scenario may seed them
  outdated on purpose.

Usage: scripts/sync_eval_stack_files.py [--check]
  --check  report every stack file that differs and exit 1, change nothing (CI)
  (none)   rewrite the stack files
"""
import glob
import os
import re
import sys

TEMPLATE = "aiup-core/skills/stack/references/stack.md"
DEFAULT_SCOPE = "Use cases and test cases"
SCOPES = (DEFAULT_SCOPE, "Test cases only")
SEPARATOR = re.compile(r"^\|[-| ]+\|$")


def paragraph(text, start):
    """The paragraph (up to the next blank line) that begins with start."""
    i = text.index("\n" + start) + 1
    end = text.find("\n\n", i)
    return text[i:end if end >= 0 else len(text)]


def cells(line):
    return [c.strip().strip("`") for c in line.strip().strip("|").split("|")]


def table_rows(text):
    return [l for l in text.splitlines() if l.startswith("|") and not SEPARATOR.match(l) and cells(l)[0] != "Layer"]


def load_template():
    t = open(TEMPLATE, encoding="utf-8").read()
    return {
        "header": t[:t.index("**Last updated:**")],
        "layers": paragraph(t, "A layer the project does not have"),
        "e2e": paragraph(t, "`Use cases and test cases`:"),
        "markers": paragraph(t, "Each layer skill keeps its own rows"),
        "all": next(l for l in t.splitlines() if l.startswith("| All")),
    }


def load_markers():
    refs = {}
    for path in glob.glob("aiup-*/skills/*/references/markers.md"):
        refs[path.split("/")[2]] = table_rows(open(path, encoding="utf-8").read())
    return refs


def layer_cell(text, layer, column):
    m = re.search(rf"^\|\s*{layer}\s*\|.*$", text.split("## Markers")[0], re.M)
    return cells(m.group(0))[column] if m else ""


def replace_paragraph(text, start, new, problems, label):
    if ("\n" + start) not in text:
        problems.append(f"no {label} (not fixed)")
        return text
    old = paragraph(text, start)
    if old != new:
        problems.append(f"{label} differs from the template")
        text = text.replace(old, new, 1)
    return text


def sync(path, template, refs):
    scenario = path.split("/")[2]
    text = open(path, encoding="utf-8").read()
    problems = []

    for heading in ("## Layers", "**Integration layer:**", "## Markers"):
        if heading not in text:
            problems.append(f"no {heading} (not fixed)")
    if "**Last updated:**" not in text:
        problems.append("no **Last updated:** (not fixed)")
    if problems:
        return text, problems, False

    i = text.index("**Last updated:**")
    if text[:i] != template["header"]:
        problems.append("header differs from the template")
        text = template["header"] + text[i:]

    text = replace_paragraph(text, "A layer the project does not have", template["layers"], problems,
                             "Integration layer explanation")

    has_e2e = layer_cell(text, "E2E", 1) not in ("", "–", "-")
    scope = re.search(r"^\*\*E2E scope:\*\* (.*)$", text, re.M)
    if has_e2e and not scope:
        problems.append("E2E layer without an **E2E scope:** line")
        layers = template["layers"]
        text = text.replace(layers, f"{layers}\n\n**E2E scope:** {DEFAULT_SCOPE}\n\n{template['e2e']}", 1)
    elif has_e2e:
        if scope.group(1).strip() not in SCOPES:
            problems.append(f"unknown E2E scope '{scope.group(1).strip()}' (not fixed)")
        if "\n`Use cases and test cases`:" not in text:
            problems.append("no E2E scope explanation")
            text = text.replace(scope.group(0), f"{scope.group(0)}\n\n{template['e2e']}", 1)
        else:
            text = replace_paragraph(text, "`Use cases and test cases`:", template["e2e"], problems,
                                     "E2E scope explanation")
    elif scope:
        problems.append("**E2E scope:** line without an E2E layer (not fixed)")

    head, markers = text.split("## Markers", 1)
    markers = replace_paragraph("\n" + markers, "Each layer skill keeps its own rows", template["markers"], problems,
                                "Markers intro")[1:]
    lines = markers.split("\n")
    all_rows = [n for n, l in enumerate(lines) if l.startswith("|") and cells(l)[0] == "All"]
    if not all_rows:
        problems.append("no All row in the Markers table (not fixed)")
    elif cells(lines[all_rows[0]]) != cells(template["all"]):
        problems.append("All row differs from the template")
        lines[all_rows[0]] = template["all"]

    under_test = max((s for s in refs if scenario.startswith(s + "-")), key=len, default=None)
    location = layer_cell(head, "Migration", 4)
    for skill, ref in refs.items():
        if skill == under_test:
            continue
        positions = [n for n, l in enumerate(lines) if l.startswith("|") and len(cells(l)) > 1 and cells(l)[1] == skill]
        if not positions:
            continue
        expected = [l.replace("<location>", location) for l in ref]
        if [cells(lines[n]) for n in positions] != [cells(l) for l in expected]:
            problems.append(f"{skill} marker rows differ from its markers reference")
            first = positions[0]
            lines = [l for n, l in enumerate(lines) if n not in positions]
            lines[first:first] = expected
    text = head + "## Markers" + "\n".join(lines)

    fixable = not any("not fixed" in p for p in problems)
    return text, problems, fixable


def main():
    check = sys.argv[1:] == ["--check"]
    if sys.argv[1:] not in ([], ["--check"]):
        sys.exit(f"usage: {sys.argv[0]} [--check]")
    os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
    template, refs = load_template(), load_markers()
    failed = False
    for path in sorted(glob.glob("aiup-*/evals/*/*/docs/architecture/stack.md")):
        if "/layer-skills/" in path:
            continue
        text, problems, fixable = sync(path, template, refs)
        if not problems:
            continue
        if check or not fixable:
            failed = True
            for p in problems:
                print(f"DRIFT: {path}: {p}")
        if not check:
            open(path, "w", encoding="utf-8").write(text)
            print(f"synced {path}")
    if failed:
        print("ERROR: seeded stack files drifted from the stack template or the markers references; "
              "run scripts/sync-eval-fixtures.sh", file=sys.stderr)
        sys.exit(1)
    if check:
        print("Seeded stack files match the stack template and the markers references.")


if __name__ == "__main__":
    main()
