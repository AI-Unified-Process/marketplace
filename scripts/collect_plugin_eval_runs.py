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
import shutil
import sys
from pathlib import Path

SKIP = {"node_modules", "target", "build", "bin", "obj", ".git", ".gradle", ".m2", ".npm", ".cache", "dist", ".next"}
MAX_FILE = 5 * 1024 * 1024


def ignore(folder: str, names: list[str]) -> set[str]:
    base = Path(folder)
    return {n for n in names if n in SKIP or ((base / n).is_file() and (base / n).stat().st_size > MAX_FILE)}


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
                # claude plugin eval seals what the plugin wrote to home/ and tmp/ (mode 000): skip what is unreadable
                for sub in sorted(p for p in scaffold.iterdir() if p.is_dir() and p != trace.parent):
                    if sub.name == "sealed" or not os.access(sub, os.R_OK | os.X_OK):
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
