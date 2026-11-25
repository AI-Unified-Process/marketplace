#!/usr/bin/env python3
# Copyright 2026 Simon Martinelli and the AI Unified Process contributors
# SPDX-License-Identifier: Apache-2.0
"""Copy what each run of `claude plugin eval --keep-temp` left behind into one folder per run.

The JSON result and the HTML report hold each grader's verdict, but not what the agent did. With --keep-temp the
scaffold directory of every run stays; its trace.jsonl and the workspace (session-log.md, the files the agent wrote)
tell a failed grader from a failed skill. Usage:

  collect_plugin_eval_runs.py build/eval-result.json build/runs

writes build/runs/<case>/<arm>-<n>/ with trace.jsonl and workspace/, leaving out dependency and build folders.
Standard library only; a missing result or scaffold is reported, never an error.
"""
from __future__ import annotations

import json
import os
import re
import shutil
import sys
from pathlib import Path

SKIP = {"node_modules", "target", "build", "bin", "obj", ".git", ".gradle", ".m2", ".npm", ".cache", "dist", ".next"}
MAX_FILE = 5 * 1024 * 1024
re_refused = re.compile(r"denied|not allowed|permission|classifier|blocked", re.I)


def ignore(folder: str, names: list[str]) -> set[str]:
    base = Path(folder)
    return {n for n in names if n in SKIP or ((base / n).is_file() and (base / n).stat().st_size > MAX_FILE)}


def print_trace_facts(case: str, run: str, trace: Path) -> None:
    """The skills the session could see, the Skill calls it made, and the tool calls refused, in the job log."""
    skills: list[str] = []
    calls: list[str] = []
    refused: list[str] = []
    for line in trace.read_text(encoding="utf-8", errors="replace").splitlines():
        try:
            event = json.loads(line)
        except ValueError:
            continue
        if not isinstance(event, dict):
            continue
        if event.get("type") == "system" and event.get("subtype") == "init":
            skills = [str(s) for s in event.get("skills") or event.get("slash_commands") or []]
        content = ((event.get("message") or {}).get("content")) if isinstance(event.get("message"), dict) else None
        for block in content if isinstance(content, list) else []:
            if not isinstance(block, dict):
                continue
            if block.get("type") == "tool_use" and block.get("name") == "Skill":
                calls.append(json.dumps(block.get("input"))[:200])
            if block.get("type") == "tool_result" and block.get("is_error"):
                text = block.get("content")
                text = json.dumps(text) if not isinstance(text, str) else text
                if re_refused.search(text):
                    refused.append(text[:300])
    first = trace.read_text(encoding="utf-8", errors="replace").split("\n", 1)[0]
    print(f"{case} {run}: trace starts {first[:800]}")
    print(f"{case} {run}: {len(skills)} skill(s) visible: {', '.join(s for s in skills if 'aiup' in s or ':' in s)[:600]}")
    print(f"{case} {run}: Skill calls: {calls or 'none'}")
    for r in refused[:5]:
        print(f"{case} {run}: refused: {r}")


def main() -> int:
    if len(sys.argv) != 3:
        print(__doc__)
        return 2
    result, out = Path(sys.argv[1]), Path(sys.argv[2])
    if not result.is_file():
        print(f"{result}: no result, nothing to collect")
        return 0
    data = json.loads(result.read_text(encoding="utf-8"))
    copied = 0
    for case in data.get("cases", []):
        for arm, runs in (case.get("arms") or {}).items():
            for n, run in enumerate(runs, 1):
                failed = [g for g in run.get("graders", []) if not g.get("passed")]
                print(f"{case['name']} {arm}-{n}: score {run.get('score')}, {len(failed)} grader(s) failed")
                for g in failed:  # the verdicts in the job log too, for the same reason as the session log
                    print(f"  FAIL {g.get('name')} (weight {g.get('weight')}): {str(g.get('explanation'))[:300]}")
                trace = Path(run.get("tracePath") or "")
                scaffold = trace.parent.parent if trace.name else None
                target = out / case["name"] / f"{arm}-{n}"
                if not scaffold or not scaffold.is_dir():
                    print(f"{case['name']} {arm}-{n}: scaffold {scaffold} gone (was --keep-temp set?)")
                    continue
                target.mkdir(parents=True, exist_ok=True)
                if trace.is_file():
                    shutil.copy2(trace, target / "trace.jsonl")
                    print_trace_facts(case["name"], f"{arm}-{n}", trace)
                # claude plugin eval seals home/ and tmp/ (the workspace too) in sealed/ (mode 000) and makes the kept
                # folder read-only. Opening them is safe on a throwaway runner as long as nothing loads configuration
                # from inside (no git there): they are only copied.
                sealed = scaffold / "sealed"
                if sealed.exists():
                    try:
                        scaffold.chmod(0o700)
                        sealed.chmod(0o700)
                        for root, dirs, _ in os.walk(sealed):  # top-down: each folder opened before it is entered
                            for d in dirs:
                                if not os.path.islink(os.path.join(root, d)):
                                    os.chmod(os.path.join(root, d), 0o700)
                    except OSError as e:
                        print(f"{case['name']} {arm}-{n}: could not open sealed/ ({str(e)[:200]})")
                for sub in sorted(p for p in scaffold.iterdir() if p.is_dir() and p != trace.parent):
                    if not os.access(sub, os.R_OK | os.X_OK):
                        continue
                    try:
                        shutil.copytree(sub, target / "workspace" / sub.name, ignore=ignore, symlinks=True,
                                        dirs_exist_ok=True)
                    except (OSError, shutil.Error) as e:
                        print(f"{case['name']} {arm}-{n}: {sub.name} copied in part ({str(e)[:200]})")
                copied += 1
                logs = sorted((target / "workspace").glob("**/session-log.md"))
                if logs:  # in the job log too: the artifact is a zip on a host a sandbox may not reach
                    text = logs[0].read_text(encoding="utf-8", errors="replace")
                    print(f"::group::{case['name']} {arm}-{n} score {run.get('score')}: session-log.md")
                    print(text if len(text) <= 20000 else text[:20000] + "\n[... cut at 20000 characters]")
                    print("::endgroup::")
    print(f"Collected {copied} run(s) into {out}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
