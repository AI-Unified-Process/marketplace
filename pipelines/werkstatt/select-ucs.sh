#!/usr/bin/env bash
#
# Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
# Part of the AI Unified Process — https://unifiedprocess.ai
# Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
#
# AI Unified Process Werkstatt - which use cases a run builds.
#
# Every use case of the change: its specification differs from the merge base with the default branch and its
# status is Approved (Genehmigt). The status is the memory between runs: a run that builds a use case moves it to
# Tested in its pull request, so after the merge into the change branch it is no longer selected; a blocked or
# stuck use case stays Approved and is selected again. Prints the ids in id order, space-separated.
#
# Usage: select-ucs.sh <engine> <default-branch>
set -euo pipefail
engine="$1"
default_branch="$2"
base=$(git merge-base "origin/$default_branch" HEAD)

# NUL-separated and unquoted, so a file name with an umlaut or a space is read as it is; without rename detection, so
# a specification moved into a module folder (docs/use_cases/<slug>/) counts as added there.
git -c core.quotePath=false diff -z --name-only --no-renames --diff-filter=AM "$base" HEAD \
    -- ':(glob)docs/use_cases/**/UC-*.md' |
while IFS= read -r -d '' f; do
  [ "$(python3 "$engine/pipelines/werkstatt/werkstatt.py" status "$f")" = "2" ] || continue
  basename "$f" | grep -oE '^UC-[0-9]+' || true
done | sort -t- -k2,2n -u | paste -sd' ' -
