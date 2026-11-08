#!/usr/bin/env bash
#
# Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
# Part of the AI Unified Process — https://unifiedprocess.ai
# Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
#
# AI Unified Process Werkstatt - builds the use cases of a change one after another on the checked-out branch.
#
# Stops at the first use case that ends blocked or stuck: later use cases of the same change may build on it.
# The skipped ones are recorded as pending and stay Approved, so the next run selects them again.
# Writes .werkstatt/report.md (the pull request body) and the outcome to GITHUB_OUTPUT.
#
# Usage: run-change.sh UC-001 UC-002 ...    Env: see run-uc.sh, plus CORRELATION_ID
set -uo pipefail

outcome=ready
stopped_at=""
for uc in "$@"; do
  if [ -n "$stopped_at" ]; then
    mkdir -p ".werkstatt/$uc"
    jq -n --arg uc "$uc" --arg by "$stopped_at" \
      '{uc:$uc, outcome:"pending", reason:("Not built in this run: waits for " + $by + "."), fix_rounds:0,
        cost_usd:0, seconds:0}' > ".werkstatt/$uc/summary.json"
    continue
  fi
  UC="$uc" bash "$ENGINE/pipelines/werkstatt/run-uc.sh"
  o=$(jq -r '.outcome // "stuck"' ".werkstatt/$uc/summary.json" 2>/dev/null || echo stuck)
  if [ "$o" != "ready" ]; then
    outcome="$o"
    stopped_at="$uc"
  fi
done

python3 - "$@" <<'EOF' > .werkstatt/report.md
import json, os, sys
rows, details, total = [], [], 0.0
for uc in sys.argv[1:]:
    path = f".werkstatt/{uc}/summary.json"
    if not os.path.isfile(path):
        continue
    s = json.load(open(path))
    total += float(s.get("cost_usd") or 0)
    rows.append(f"| {uc} | **{s['outcome']}** | {s.get('status') or '–'} | {s.get('fix_rounds', 0)} | {float(s.get('cost_usd') or 0):.2f} |")
    part = [f"### {uc}", "", s.get("reason", "")]
    if s.get("spec"):
        part += ["", f"Specification: `{s['spec']}`"]
    lint = f".werkstatt/{uc}/lint.txt"
    if s["outcome"] == "blocked" and os.path.isfile(lint) and open(lint).read().strip():
        part += ["", "<details><summary>Spec lint</summary>", "", "```text", open(lint).read().strip(), "```", "", "</details>"]
    cov = f".werkstatt/{uc}/coverage.md"
    if os.path.isfile(cov):
        part += ["", "<details><summary>Spec coverage matrix</summary>", "", open(cov).read().strip(), "", "</details>"]
    guard = f".werkstatt/{uc}/guard.log"
    if os.path.isfile(guard):
        part += ["", "Harness guard:"] + [f"- {l.strip()}" for l in open(guard) if l.strip()]
    details.append("\n".join(part))
print("Built by the AI Unified Process Werkstatt. Each use case went through spec lint, implementation, tests, build,")
print("and the spec coverage audit, each step in its own session. Only use cases that passed every gate carry code;")
print("a blocked use case contributes its open questions only.")
print()
print("| Use case | Outcome | Status | Fix rounds | Cost (USD) |")
print("| --- | --- | --- | --- | --- |")
print("\n".join(rows))
print()
print(f"Total cost: {total:.2f} USD")
print()
print("\n\n".join(details))
print()
print("The content is a proposal and is to be reviewed before it is taken over.")
print()
print(f"aiup-run: {os.environ.get('CORRELATION_ID', '')}")
EOF

{
  echo "outcome=$outcome"
  echo "use_cases=$*"
} >> "${GITHUB_OUTPUT:-/dev/null}"
cat .werkstatt/report.md
