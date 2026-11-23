#!/usr/bin/env python3
# Copyright 2026 Simon Martinelli and the AI Unified Process contributors
# SPDX-License-Identifier: Apache-2.0
"""Convert the Tessl scenarios in evals/<plugin>/ into other eval formats.

evals/<plugin>/<scenario>/ (task.md, scenario.json, criteria.json) stays the single source. This script writes
generated copies that are not committed:

  --format plugin-eval   (default) cases for `claude plugin eval`, under <out>/<plugin>/evals/<scenario>/:
                         prompt.md, case.yaml, fixture.sh, graders/<nn>-<slug>.md (one llm grader per checklist item,
                         weight = max_score). Run with:
                           claude plugin eval <out>/<plugin> --scaffold --allow-tools Write Edit Bash --runs 1
  --format skill-evals   Agent Skills evals.json (https://agentskills.io/skill-creation/evaluating-skills), one file
                         per plugin at <out>/<plugin>/evals.json; max_score is kept as "weights".

Limits of `claude plugin eval` this conversion has to live with (https://code.claude.com/docs/en/plugin-evals.md):
an llm grader reads one file (or the final message), and project .claude/skills and .claude/agents do not load in
the run. The layer-skills and agents fixtures are therefore replaced by loading the real plugins that own those
skills and agents, and each grader judges the one file its criterion names first (session-log.md for criteria about
what the agent said). The report lists every grader whose criterion names more than one file.

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


def focus_for(description: str, logs_messages: bool) -> tuple[str, list[str]]:
    paths = list(dict.fromkeys(m.group(1) for m in PATH_RE.finditer(description)))
    paths = [p for p in paths if p != "session-log.md"]
    if logs_messages and (not paths or SAYS_RE.search(description) and "agent" in description.lower()):
        return "session-log.md", paths
    if paths:
        return paths[0], paths[1:]
    return "session-log.md" if logs_messages else "last_message", []


def yaml_str(s: str) -> str:
    return json.dumps(s, ensure_ascii=False)


def write_plugin_eval(plugin: str, scenario: Path, out: Path, report: list[str]) -> None:
    task, meta, criteria = load(scenario)
    case = out / plugin / "evals" / scenario.name
    if case.exists():
        shutil.rmtree(case)
    (case / "graders").mkdir(parents=True)

    pairs, extra = copies(scenario, meta)
    under_test = ROOT / plugin
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
    logs_messages = "session-log.md" in task
    for i, item in enumerate(criteria["checklist"], 1):
        focus, others = focus_for(item["description"], logs_messages)
        focus_yaml = focus if focus == "last_message" else f"{{ source: file, path: {yaml_str(focus)} }}"
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
    args = ap.parse_args()

    plugins = args.plugins or sorted(p.name for p in EVALS.iterdir() if p.is_dir())
    report: list[str] = []
    count = 0
    for plugin in plugins:
        scenarios = sorted(p for p in (EVALS / plugin).iterdir() if (p / "task.md").is_file())
        if args.case:
            scenarios = [s for s in scenarios if s.name in args.case]
        if not scenarios:
            continue
        if args.format == "skill-evals":
            write_skill_evals(plugin, scenarios, args.out.resolve())
        else:
            for s in scenarios:
                write_plugin_eval(plugin, s, args.out.resolve(), report)
        count += len(scenarios)
    print(f"{count} scenario(s) written to {args.out}")
    if report:
        print(f"{len(report)} grader(s) judge one file of several:")
        for line in report:
            print("  " + line)
    return 0 if count else 1


if __name__ == "__main__":
    sys.exit(main())
