#!/usr/bin/env python3
"""Restores the Git history of this project, which was exported without its .git folder.

Replays the snapshots in history/ as commits with their original authors and dates, then removes history/.
"""
import os
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
HISTORY = ROOT / "history"
IDENTITY = {"GIT_AUTHOR_NAME": "P. Meier", "GIT_AUTHOR_EMAIL": "p.meier@example.com",
            "GIT_COMMITTER_NAME": "P. Meier", "GIT_COMMITTER_EMAIL": "p.meier@example.com"}

# (snapshot, date, message); ("tag", date, name, message) and ("mv", source, target) between them
STEPS = [
    ("01", "2026-03-02T10:00:00+01:00", "docs: specify the workshop registration"),
    ("02", "2026-06-30T16:00:00+02:00", "chore: release 2.0.0"),
    ("03", "2026-09-10T11:00:00+02:00", "docs: UC-003 accepted"),
    ("04", "2026-10-15T15:30:00+02:00", "docs: specify and test UC-004"),
]


def git(*args, date=None, check=True, capture=False):
    env = dict(os.environ, **IDENTITY)
    if date:
        env["GIT_AUTHOR_DATE"] = env["GIT_COMMITTER_DATE"] = date
    command = ["git", "-c", "commit.gpgsign=false", "-c", "tag.gpgsign=false", "-c", "core.hooksPath=/dev/null",
               *args]
    return subprocess.run(command, cwd=ROOT, env=env, check=check, text=True,
                          capture_output=capture)


def commit(step, date, message):
    shutil.copytree(HISTORY / step, ROOT, dirs_exist_ok=True)
    git("add", "-A", "docs")
    git("commit", "-q", "-m", message, date=date)


def main():
    if not HISTORY.is_dir():
        print("history/ not found; the history is already restored.")
        return 1
    if git("rev-parse", "--git-dir", check=False, capture=True).returncode != 0:
        git("init", "-q")
        git("symbolic-ref", "HEAD", "refs/heads/main")
    for step in STEPS:
        if step[0] == "tag":
            git("tag", "-a", step[2], "-m", step[3], date=step[1])
        elif step[0] == "mv":
            git("mv", step[1], step[2])
        else:
            commit(*step)
    shutil.rmtree(HISTORY)
    commits = git("rev-list", "--count", "HEAD", capture=True).stdout.strip()
    tags = git("tag", capture=True).stdout.split()
    print(f"History restored: {commits} commits, {len(tags)} tag(s){': ' + ', '.join(tags) if tags else ''}.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
