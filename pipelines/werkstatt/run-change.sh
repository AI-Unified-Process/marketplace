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
# A use case that is not Approved (Genehmigt), or has no specification, is never built, also when the use_cases input
# names it: it is recorded as skipped with the reason, and the run goes on with the next one.
# Writes .werkstatt/report.md (the pull request body) and the outcome to GITHUB_OUTPUT.
#
# DEADLINE (epoch seconds, optional) is when the stations must have stopped, early enough for the pull request
# to be opened before the job's timeout. A use case still running then is stopped and ends stuck; the ones before
# it keep their result, so finished work is never lost to the timeout.
#
# Usage: run-change.sh UC-001 UC-002 ...    Env: see run-uc.sh, plus CORRELATION_ID and DEADLINE
set -uo pipefail

DEADLINE="${DEADLINE:-}"
HELPER="$ENGINE/pipelines/werkstatt/werkstatt.py"
outcome=ready
pending_reason=""
built=0

# pending <uc> <reason>
pending() {
  mkdir -p ".werkstatt/$1"
  jq -n --arg uc "$1" --arg reason "$2" \
    '{uc:$uc, outcome:"pending", reason:$reason, fix_rounds:0, cost_usd:0, seconds:0}' > ".werkstatt/$1/summary.json"
}

# skipped <uc> <reason>
skipped() {
  echo "::warning::$1: $2"
  mkdir -p ".werkstatt/$1"
  jq -n --arg uc "$1" --arg reason "$2" \
    '{uc:$uc, outcome:"skipped", reason:$reason, fix_rounds:0, cost_usd:0, seconds:0}' > ".werkstatt/$1/summary.json"
}

# drop <uc> <start sha>: the use case's changes go into its dropped.diff, the working tree back to the start.
drop() {
  mkdir -p ".werkstatt/$1"
  git add -A
  git diff --cached "$2" > ".werkstatt/$1/dropped.diff"
  git reset -q --hard "$2"
  git clean -fdq
}

for uc in "$@"; do
  # The status gate, also for ids given by hand: the agents build nothing that is not approved.
  if ! spec=$(python3 "$HELPER" spec "$uc" 2>/dev/null); then
    skipped "$uc" "Not built: $uc has no specification under docs/use_cases."
    continue
  fi
  if [ "$(python3 "$HELPER" status "$spec")" != "2" ]; then
    state=$(sed -n 's/^\*\*Status:\*\*[[:space:]]*\([^[:space:]]*\).*/\1/p' "$spec" | head -1)
    skipped "$uc" "Not built: $uc is ${state:-without a status}, not Approved (Genehmigt). Approve the specification first."
    continue
  fi
  if [ -n "$pending_reason" ]; then
    pending "$uc" "$pending_reason"
    continue
  fi
  left=""
  if [ -n "$DEADLINE" ]; then
    left=$(( DEADLINE - $(date +%s) ))
    if [ "$left" -le 0 ]; then
      outcome=pending
      pending_reason="Not built in this run: the run's time (timeout_minutes) was up."
      pending "$uc" "$pending_reason"
      continue
    fi
  fi

  start_sha=$(git rev-parse HEAD)
  t0=$(date +%s)
  built=$((built + 1))
  rc=0
  if [ -n "$left" ]; then
    # timeout signals the whole process group, so the Claude Code session and a running build stop as well.
    timeout --kill-after=60 "$left" env UC="$uc" bash "$ENGINE/pipelines/werkstatt/run-uc.sh" || rc=$?
  else
    UC="$uc" bash "$ENGINE/pipelines/werkstatt/run-uc.sh" || rc=$?
  fi

  if [ "$rc" -eq 124 ] || [ "$rc" -eq 137 ]; then
    # Stopped by the deadline in the middle of a station: drop its code like a stuck use case, keep it as a diff.
    echo "::warning::$uc: the run's time (timeout_minutes) was up; the use case was stopped."
    drop "$uc" "$start_sha"
    # The cost of the interrupted station is unknown; only the finished stations count.
    cost=0
    [ -s ".werkstatt/$uc/metrics.jsonl" ] && cost=$(jq -s 'map(.cost_usd) | add // 0' ".werkstatt/$uc/metrics.jsonl")
    jq -n --arg uc "$uc" --argjson cost "${cost:-0}" --argjson sec "$(( $(date +%s) - t0 ))" \
      '{uc:$uc, outcome:"stuck", fix_rounds:0, cost_usd:$cost, seconds:$sec,
        reason:"The run'"'"'s time (timeout_minutes) was up while this use case was built. Start the run again, or raise timeout_minutes."}' \
      > ".werkstatt/$uc/summary.json"
  elif [ ! -s ".werkstatt/$uc/summary.json" ]; then
    # The stations stopped without a result (a crash, a killed process): stuck, and the report says so.
    echo "::warning::$uc: the stations stopped with exit code $rc and wrote no result."
    drop "$uc" "$start_sha"
    cost=0
    [ -s ".werkstatt/$uc/metrics.jsonl" ] && cost=$(jq -s 'map(.cost_usd) | add // 0' ".werkstatt/$uc/metrics.jsonl")
    jq -n --arg uc "$uc" --argjson cost "${cost:-0}" --argjson sec "$(( $(date +%s) - t0 ))" \
      --arg reason "The stations of $uc stopped with exit code $rc before they wrote a result; its changes were dropped (dropped.diff in the run records). See the run's log, then start the run again." \
      '{uc:$uc, outcome:"stuck", fix_rounds:0, cost_usd:$cost, seconds:$sec, reason:$reason}' \
      > ".werkstatt/$uc/summary.json"
  fi

  o=$(jq -r '.outcome // "stuck"' ".werkstatt/$uc/summary.json" 2>/dev/null || echo stuck)
  if [ "$o" != "ready" ]; then
    outcome="$o"
    pending_reason="Not built in this run: waits for $uc."
  fi
done
# Nothing was built and nothing waits: every use case named was skipped.
[ "$built" -gt 0 ] || [ "$outcome" != ready ] || outcome=none

python3 - "$@" <<'EOF' > .werkstatt/report.md
import json, os, sys
rows, details, total = [], [], 0.0
for uc in sys.argv[1:]:
    path = f".werkstatt/{uc}/summary.json"
    try:
        s = json.load(open(path))
    except (OSError, ValueError):
        s = {"outcome": "stuck", "reason": "The run records of this use case are missing or unreadable; see the run's log."}
    total += float(s.get("cost_usd") or 0)
    rows.append(f"| {uc} | **{s['outcome']}** | {s.get('status') or '–'} | {s.get('fix_rounds', 0)} | {float(s.get('cost_usd') or 0):.2f} |")
    part = [f"### {uc}", "", s.get("reason", "")]
    if s.get("spec"):
        part += ["", f"Specification: `{s['spec']}`"]
    if s.get("requirements"):
        part += ["", f"Requirements: {s['requirements']}"]
    lint = f".werkstatt/{uc}/lint.txt"
    if s["outcome"] == "blocked" and os.path.isfile(lint) and open(lint).read().strip():
        part += ["", "<details><summary>Spec lint</summary>", "", "```text", open(lint).read().strip(), "```", "", "</details>"]
    cov = f".werkstatt/{uc}/coverage.md"
    if os.path.isfile(cov):
        part += ["", "<details><summary>Spec coverage matrix</summary>", "", open(cov).read().strip(), "", "</details>"]
    notes = f".werkstatt/{uc}/notes.log"
    if os.path.isfile(notes):
        part += ["", "Notes:"] + [f"- {l.strip()}" for l in open(notes) if l.strip()]
    guard = f".werkstatt/{uc}/guard.log"
    if os.path.isfile(guard):
        part += ["", "Harness guard:"] + [f"- {l.strip()}" for l in open(guard) if l.strip()]
    details.append("\n".join(part))
print("Built by the AI Unified Process Werkstatt. Each use case went through spec lint, implementation, tests, build,")
print("and the spec coverage audit, each step in its own session. Only use cases that passed every gate carry code;")
print("a blocked use case contributes its open questions only, and a skipped one (not Approved) was not built.")
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
