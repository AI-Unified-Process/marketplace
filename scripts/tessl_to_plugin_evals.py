#!/usr/bin/env python3
# Copyright 2026 Simon Martinelli and the AI Unified Process contributors
# SPDX-License-Identifier: Apache-2.0
"""Convert the Tessl scenarios in evals/<plugin>/ into other eval formats.

evals/<plugin>/<scenario>/ (task.md, scenario.json, criteria.json) stays the single source. This script writes
generated copies that are not committed:

  --format plugin-eval   (default) cases for `claude plugin eval`, under <out>/<plugin>/evals/<scenario>/:
                         prompt.md, case.yaml, fixture.sh, graders/<nn>-<slug>.md (one llm grader per checklist item,
                         weight = max_score). Run from the repository root (docs/evals.md):
                           claude plugin eval . --eval-dir <out>/<plugin>/evals --scaffold --trust-plugin \\
                             --allow-tools Write Edit Bash --runs 1 -j 1
  --format skill-evals   Agent Skills evals.json (https://agentskills.io/skill-creation/evaluating-skills), one file
                         per plugin at <out>/<plugin>/evals.json; max_score is kept as "weights".

Limits of `claude plugin eval` this conversion has to live with (https://code.claude.com/docs/en/plugin-evals.md):
an llm grader reads one file (or the final message), and project .claude/skills and .claude/agents do not load in
the run. The layer-skills and agents fixtures are therefore replaced by loading the real plugins that own those
skills and agents, and each grader judges the one file its criterion names first (session-log.md for criteria about
what the agent said, else the one document the task asks for). The report lists every grader whose criterion names more
than one file. A criterion with no file to judge gets no grader, because a judge shown the wrong text fails good work;
a scenario with fewer than MIN_POINTS gradable points is not written. focus.json in the scenario names the file where
the rules cannot tell it, or null.

Hand graders: a scenario may hold graders/<name>.md files in the `claude plugin eval` grader format with one extra
front matter line, `criterion: "<checklist item name>"`. They replace the generated llm grader of that item, and their
weights must add up to its max_score. criteria.json stays the rubric Tessl reads. --check validates every hand grader
and writes nothing.

Standard library only.
"""
from __future__ import annotations

import argparse
import json
import os
import re
import shutil
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
EVALS = ROOT / "evals"

TOOLS = ["Read", "Glob", "Grep", "Skill", "Write", "Edit", "Bash", "Agent", "TodoWrite"]
PATH_RE = re.compile(
    r"(?<![\w/.-])((?:[\w.@-]+/)*[\w.-]+\.(?:md|puml|bpmn|java|kt|ts|tsx|js|sql|json|html|yaml|yml|xml|py|razor|cs|"
    r"properties|csproj))\b"
)
SAYS_RE = re.compile(
    r"\b(agent|answer|tells?|told|reports?|says?|states?|names?|asks?|hands? off|hand-off|handover|lists?|summary|"
    r"message|verdict|explains?|refuses?|warns?)\b",
    re.I,
)


def slug(text: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")[:48] or "item"


def skill_owner(skill: str) -> Path | None:
    hits = sorted(ROOT.glob(f"aiup-*/skills/{skill}"))
    return hits[0].parent.parent if hits else None


def agent_owner(agent_file: str) -> Path | None:
    hits = sorted(ROOT.glob(f"aiup-*/agents/{agent_file}"))
    return hits[0].parent.parent if hits else None


def dependencies(plugin: Path, seen: set[Path] | None = None) -> set[Path]:
    """The plugins of this repository that .claude-plugin/plugin.json declares as dependencies, transitively."""
    seen = set() if seen is None else seen
    manifest = plugin / ".claude-plugin" / "plugin.json"
    if not manifest.is_file():
        return set()
    for dep in json.loads(manifest.read_text(encoding="utf-8")).get("dependencies") or []:
        path = ROOT / (dep.get("name") if isinstance(dep, dict) else str(dep))
        if path.is_dir() and path not in seen:
            seen.add(path)
            dependencies(path, seen)
    return seen


def load(scenario: Path) -> tuple[str, dict, dict]:
    task = (scenario / "task.md").read_text(encoding="utf-8")
    meta = json.loads((scenario / "scenario.json").read_text(encoding="utf-8"))
    criteria = json.loads((scenario / "criteria.json").read_text(encoding="utf-8"))
    return task, meta, criteria


def copies(scenario: Path, meta: dict) -> tuple[list[tuple[Path, str]], set[Path]]:
    """(source, workspace target) pairs to copy, and the extra plugins to load instead of .claude fixtures."""
    pairs: list[tuple[Path, str]] = []
    plugins: set[Path] = set()
    if "include" in meta:
        texts = (scenario / "task.md").read_text(encoding="utf-8") + (scenario / "criteria.json").read_text(encoding="utf-8")
        for inc in meta["include"]:
            src = (scenario / inc).resolve()
            # Most tasks and rubrics name docs/... although the files sit under inputs/docs/: an inputs folder is
            # unpacked into the workspace root unless the scenario itself names the inputs/ folder.
            flatten = src.name == "inputs" and "inputs/" not in texts
            pairs.append((src, "." if flatten else src.name))
    for fx in (meta.get("fixtures") or {}).values():
        src = (scenario / fx["path"]).resolve()
        target = fx["installPath"]
        if target == ".claude/skills":
            for d in sorted(p for p in src.iterdir() if p.is_dir()):
                owner = skill_owner(d.name)
                if owner:
                    plugins.add(owner)
        elif target == ".claude/agents":
            for f in sorted(src.glob("*.md")):
                owner = agent_owner(f.name)
                if owner:
                    plugins.add(owner)
        else:
            pairs.append((src, target))
    return pairs, plugins


# A name pattern, not a file: .spec.ts, V00N__create_x.sql, UC-XXX-short-name.md, V2__<name>.sql cut at the bracket.
PATTERN_RE = re.compile(r"(^|/)\.[a-z]+\.|00N|XXX|^__")
MIN_POINTS = 50  # a scenario with fewer gradable points is not written: its score would say too little


def fixture_files(scenario: Path, meta: dict) -> set[str]:
    """Workspace paths of the files the scenario starts with."""
    found: set[str] = set()
    for src, target in copies(scenario, meta)[0]:
        for f in [src] if src.is_file() else (p for p in src.rglob("*") if p.is_file()):
            inner = "" if src.is_file() else str(f.relative_to(src))
            found.add(os.path.normpath(os.path.join(target, inner)))
    return found


def focus_overrides(scenario: Path, criteria: dict) -> tuple[dict[str, str | None], list[str]]:
    """focus.json: {"<checklist item name>" or "*": workspace path, "session-log.md", or null for not gradable}."""
    path = scenario / "focus.json"
    if not path.is_file():
        return {}, []
    data = json.loads(path.read_text(encoding="utf-8"))
    names = {c["name"] for c in criteria["checklist"]} | {"*"}
    return data, [f"{path}: {n!r} is not a checklist item of criteria.json" for n in data if n not in names]


def focus_for(item: dict, task: str, known: set[str], overrides: dict[str, str | None]) -> tuple[str | None, list[str]]:
    """The file a criterion is judged on, and the named files left unchecked; None when no file can be told."""
    description = item["description"]
    if item["name"] in overrides:
        return overrides[item["name"]], []
    logs_messages = "session-log.md" in task
    named = list(dict.fromkeys(m.group(1) for m in PATH_RE.finditer(description)))
    named = [p for p in named if p != "session-log.md" and not PATTERN_RE.search(p)]
    if description.startswith("session-log.md"):
        return "session-log.md", named
    if logs_messages and SAYS_RE.search(description) and (not named or "agent" in description.lower()):
        return "session-log.md", named
    task_paths = {p for p in PATH_RE.findall(task) if not PATTERN_RE.search(p)}
    paths = []
    for p in named:
        if "/" not in p and p not in known:  # a bare name: the one path of the task or the fixture that ends with it
            hits = {q for q in task_paths | known if q.endswith("/" + p)}
            if len(hits) != 1:
                continue
            p = hits.pop()
        paths.append(p)
    paths = list(dict.fromkeys(paths))
    if paths:
        return paths[0], paths[1:]
    if "*" in overrides:
        return overrides["*"], []
    if not named:  # no file named: the only document the task asks for
        output = task.split("## Output Specification", 1)[-1]
        made = {p for p in PATH_RE.findall(output) if "/" in p and not PATTERN_RE.search(p)} - known
        if len(made) == 1 and "session-log.md" not in made:
            return made.pop(), []
    return None, named


CRITERION_RE = re.compile(r'^criterion:\s*"(.*)"\s*$', re.M)
WEIGHT_RE = re.compile(r"^weight:\s*([0-9.]+)\s*$", re.M)
PATH_FIELD_RE = re.compile(r"""^path:\s*['"]?([^'"\n]+?)['"]?\s*$""", re.M)


def glob_re(pattern: str) -> re.Pattern:
    """A workspace glob as a regex: ** spans folders, * and ? stay inside one."""
    out = ""
    i = 0
    while i < len(pattern):
        if pattern.startswith("**/", i):
            out, i = out + "(?:.*/)?", i + 3
        elif pattern.startswith("**", i):
            out, i = out + ".*", i + 2
        elif pattern[i] == "*":
            out, i = out + "[^/]*", i + 1
        elif pattern[i] == "?":
            out, i = out + "[^/]", i + 1
        else:
            out, i = out + re.escape(pattern[i]), i + 1
    return re.compile(out + r"\Z")


def hand_graders(scenario: Path, criteria: dict) -> tuple[dict[str, list[tuple[str, str]]], list[str]]:
    """{criterion name: [(file name, grader text without the criterion line)]}, and the problems found."""
    found: dict[str, list[tuple[str, str]]] = {}
    problems: list[str] = []
    names = {c["name"]: c["max_score"] for c in criteria["checklist"]}
    for f in sorted((scenario / "graders").glob("*.md")):
        text = f.read_text(encoding="utf-8")
        m = CRITERION_RE.search(text)
        if not text.startswith("---\n") or not m:
            problems.append(f"{f}: no front matter line criterion: \"<checklist item name>\"")
            continue
        if m.group(1) not in names:
            problems.append(f"{f}: criterion {m.group(1)!r} is not a checklist item of criteria.json")
            continue
        if not WEIGHT_RE.search(text):
            problems.append(f"{f}: no weight")
            continue
        found.setdefault(m.group(1), []).append((f.name, CRITERION_RE.sub("", text, count=1).replace("---\n\n", "---\n", 1)))
    known: set[str] | None = None
    for name, graders in found.items():
        for fname, text in graders:
            if not re.search(r"^type:\s*file_exists\s*$", text, re.M):
                continue
            m = PATH_FIELD_RE.search(text)
            if not m:
                problems.append(f"{scenario / 'graders' / fname}: file_exists without a path")
                continue
            if re.search(r"[\[\]{}]", m.group(1)):
                problems.append(f"{scenario / 'graders' / fname}: glob {m.group(1)!r} uses [..] or {{..}}; split it into plain globs")
            elif re.search(r"^exists:\s*false\s*$", text, re.M):
                if known is None:
                    known = fixture_files(scenario, load(scenario)[1])
                hits = sorted(f for f in known if glob_re(m.group(1)).match(f))
                if hits:
                    problems.append(f"{scenario / 'graders' / fname}: exists: false, but the fixture already holds {hits[0]}; "
                                    "check the agent's writes with a not_contains regex instead")
    for name, graders in found.items():
        total = sum(float(WEIGHT_RE.search(t).group(1)) for _, t in graders)
        if abs(total - names[name]) > 1e-6:
            problems.append(f"{scenario}: hand graders of {name!r} weigh {total:g}, max_score is {names[name]}")
    return found, problems


def yaml_str(s: str) -> str:
    return json.dumps(s, ensure_ascii=False)


def write_plugin_eval(plugin: str, scenario: Path, out: Path, report: list[str], ungraded: list[tuple]) -> bool:
    task, meta, criteria = load(scenario)
    case = out / plugin / "evals" / scenario.name
    if case.exists():
        shutil.rmtree(case)
    (case / "graders").mkdir(parents=True)

    pairs, extra = copies(scenario, meta)
    under_test = ROOT / plugin
    # Claude Code installs a plugin's declared dependencies with it; without them the plugin under test may not load
    # as users get it (a jpa run saw none of its skills).
    extra = set(extra) | dependencies(under_test)
    for p in list(extra):
        extra |= dependencies(p)
    plugin_dirs = [under_test] + sorted(p for p in extra if p != under_test)
    rel_plugins = [os.path.relpath(p, case) for p in plugin_dirs]

    heavy = "fixtures" in meta  # chain and orchestrator scenarios build whole projects
    front = [
        "---",
        f"description: {yaml_str(meta.get('description', ''))}",
        f"plugins: [{', '.join(yaml_str(p) for p in rel_plugins)}]",
        f"max_turns: {200 if heavy else 60}",
        f"timeout_seconds: {3600 if heavy else 1200}",
        f"allowed_tools: [{', '.join(TOOLS)}]",
        "---",
        "",
    ]
    (case / "prompt.md").write_text("\n".join(front) + task, encoding="utf-8")

    lines = ["#!/usr/bin/env bash", "# Generated by scripts/tessl_to_plugin_evals.py; copies the scenario's files.", "set -euo pipefail"]
    for src, target in pairs:
        if target == ".":
            lines.append(f"cp -R {json.dumps(str(src))}/. .")
        else:
            lines.append(f"mkdir -p {json.dumps(os.path.dirname(target) or '.')}")
            lines.append(f"cp -R {json.dumps(str(src))} {json.dumps(target)}")
    (case / "fixture.sh").write_text("\n".join(lines) + "\n", encoding="utf-8")
    (case / "fixture.sh").chmod(0o755)

    (case / "case.yaml").write_text(
        f'schema_version: "1.1"\nname: {scenario.name}\ntags: [{plugin}]\ncontext:\n  scaffold_script: fixture.sh\n',
        encoding="utf-8",
    )

    context = criteria.get("context", "")
    hand, problems = hand_graders(scenario, criteria)
    overrides, unknown = focus_overrides(scenario, criteria)
    problems += unknown
    known = fixture_files(scenario, meta)
    omitted: list[dict] = []
    if problems:
        raise SystemExit("\n".join(problems))
    for i, item in enumerate(criteria["checklist"], 1):
        if item["name"] in hand:
            for name, text in hand[item["name"]]:
                (case / "graders" / f"{i:02d}-{name}").write_text(text, encoding="utf-8")
            continue
        focus, others = focus_for(item, task, known, overrides)
        if focus is None:
            omitted.append(item)
            continue
        focus_yaml = f"{{ source: file, path: {yaml_str(focus)} }}"
        body = [
            f"Scenario: {context}",
            "",
            f"Criterion \"{item['name']}\": {item['description']}",
            "",
            "PASS if the content you are shown meets the criterion. FAIL if it does not, or if the file is missing.",
        ]
        if others:
            body.append(
                "You are shown only " + focus + ". Parts of the criterion about other files ("
                + ", ".join(others) + ") cannot be checked here; judge the parts this content can show."
            )
            report.append(f"{plugin}/{scenario.name} #{i} {item['name']}: judged on {focus}, unchecked {', '.join(others)}")
        grader = [
            "---",
            "type: llm",
            f"weight: {item['max_score']}",
            f"focus: {focus_yaml}",
            "---",
            "",
            "\n".join(body),
            "",
        ]
        (case / "graders" / f"{i:02d}-{slug(item['name'])}.md").write_text("\n".join(grader), encoding="utf-8")
    points = sum(c["max_score"] for c in criteria["checklist"]) - sum(c["max_score"] for c in omitted)
    if omitted:
        skip = points < MIN_POINTS
        if skip:
            shutil.rmtree(case)
        ungraded.append((f"{plugin}/{scenario.name}", points, skip, [c["name"] for c in omitted]))
    return points >= MIN_POINTS


def write_skill_evals(plugin: str, scenarios: list[Path], out: Path) -> None:
    evals = []
    for n, scenario in enumerate(scenarios, 1):
        task, meta, criteria = load(scenario)
        pairs, extra = copies(scenario, meta)
        files = []
        for src, _target in pairs:
            files += sorted(str(p.relative_to(ROOT)) for p in src.rglob("*") if p.is_file())
        evals.append(
            {
                "id": n,
                "name": scenario.name,
                "prompt": task,
                "expected_output": criteria.get("context", ""),
                "files": files,
                "assertions": [f"{c['name']}: {c['description']}" for c in criteria["checklist"]],
                "weights": [c["max_score"] for c in criteria["checklist"]],
                "plugins": sorted(p.name for p in extra),
            }
        )
    target = out / plugin / "evals.json"
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(json.dumps({"skill_name": plugin, "evals": evals}, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("plugins", nargs="*", help="plugin folders (default: all under evals/)")
    ap.add_argument("--case", action="append", default=[], help="scenario folder name (repeatable)")
    ap.add_argument("--format", choices=["plugin-eval", "skill-evals"], default="plugin-eval")
    ap.add_argument("--out", type=Path, default=ROOT / "build" / "plugin-evals")
    ap.add_argument("--check", action="store_true", help="validate the hand graders, write nothing")
    args = ap.parse_args()

    if args.check:
        problems: list[str] = []
        scenarios = sorted(p.parent for p in EVALS.glob("*/*/graders"))
        for s in scenarios:
            problems += hand_graders(s, load(s)[2])[1]
        for f in sorted(EVALS.glob("*/*/focus.json")):
            problems += focus_overrides(f.parent, load(f.parent)[2])[1]
        for line in problems:
            print("ERROR: " + line)
        if not problems:
            print(f"Hand graders valid ({len(scenarios)} scenario(s) with hand graders).")
        return 1 if problems else 0

    plugins = args.plugins or sorted(p.name for p in EVALS.iterdir() if p.is_dir())
    report: list[str] = []
    ungraded: list[tuple] = []
    count = 0
    for plugin in plugins:
        scenarios = sorted(p for p in (EVALS / plugin).iterdir() if (p / "task.md").is_file())
        if args.case:
            scenarios = [s for s in scenarios if s.name in args.case]
        if not scenarios:
            continue
        if args.format == "skill-evals":
            write_skill_evals(plugin, scenarios, args.out.resolve())
            count += len(scenarios)
        else:
            for s in scenarios:
                count += write_plugin_eval(plugin, s, args.out.resolve(), report, ungraded)
    print(f"{count} scenario(s) written to {args.out}")
    if report:
        print(f"{len(report)} grader(s) judge one file of several:")
        for line in report:
            print("  " + line)
    for heading, skipped in (("not written, under %d gradable points" % MIN_POINTS, True), ("partly graded", False)):
        rows = [r for r in ungraded if r[2] is skipped]
        if rows:
            print(f"{len(rows)} scenario(s) {heading}; add hand graders or focus.json:")
            for name, points, _, names in rows:
                print(f"  {name}: {points} of 100 points; no file to judge: {', '.join(names)}")
    # a scenario asked for by name must not go missing silently
    return 1 if not count or args.case and any(r[2] for r in ungraded) else 0


if __name__ == "__main__":
    sys.exit(main())
