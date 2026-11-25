#!/usr/bin/env python3
"""Check the JSON result of `claude plugin eval` and print a summary table.

`claude plugin eval` exits 1 when a case scores below --threshold, but runs that hung until their timeout ended with
exit 0 (docs/design/evals.md). This check reads the result instead and fails when:

  - the result is partial (the --max-cost-usd ceiling was hit),
  - a run with the plugins has an error or skipped its paid graders, so its score counts for nothing,
  - a case's score with the plugins is below --min-score,
  - a run's trace (kept with --keep-temp) shows a tool call the safety classifier refused to run ("Not run: ...
    stopped by a safety classifier"): the agent could not write its work, so the score says nothing about the skill
    or the graders; rerun the case.

A run without the plugins that has an error makes the baseline of that case invalid; it is reported, not failed,
because the baseline never gates.

Writes the table to $GITHUB_STEP_SUMMARY as well when that variable is set. Standard library only.

Usage: scripts/check_plugin_eval_result.py <result.json> [--min-score 0.8]
"""
import argparse
import json
import os
import sys


CLASSIFIER_STOP = "Not run: the response that made this tool call was stopped by a safety classifier"


def classifier_stopped(run):
    """True when the run's trace shows a tool call the safety classifier refused to run."""
    path = run.get("tracePath")
    try:
        with open(path, encoding="utf-8", errors="replace") as f:
            return CLASSIFIER_STOP in f.read()
    except (OSError, TypeError):
        return False


def fmt(score):
    return "–" if score is None else f"{score:.2f}"


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("result")
    parser.add_argument("--min-score", type=float, default=0.8)
    args = parser.parse_args()

    with open(args.result, encoding="utf-8") as f:
        result = json.load(f)

    problems, notes = [], []
    if result.get("partial"):
        problems.append(f"partial result: {result.get('partialReason') or 'the cost ceiling was hit'}")

    rows = []
    for case in result.get("cases", []):
        name = case["name"]
        aggregates = case.get("aggregates", {})
        arms = case.get("arms", {})
        for run in arms.get("with", []):
            if run.get("error"):
                problems.append(f"{name}: a run with the plugins ended on an error: {run['error'][:200]}")
            if run.get("skippedPaidGraders"):
                problems.append(f"{name}: a run with the plugins skipped its llm graders (cost ceiling)")
            if classifier_stopped(run):
                problems.append(f"{name}: a run with the plugins is invalid, the safety classifier refused a tool call; "
                                "rerun the case")
        for run in arms.get("without", []):
            if classifier_stopped(run):
                notes.append(f"{name}: the baseline is invalid, the safety classifier refused a tool call")
        baseline_errors = [run["error"] for run in arms.get("without", []) if run.get("error")]
        for error in baseline_errors:
            notes.append(f"{name}: the baseline is invalid, a run without the plugins ended on: {error[:200]}")
        score = aggregates.get("score")
        if score is None or score < args.min_score:
            problems.append(f"{name}: scored {fmt(score)} with the plugins, below {args.min_score}")
        without = None if baseline_errors else aggregates.get("scoreWithout")
        delta = None if without is None or score is None else score - without
        rows.append((name, fmt(score), fmt(without), fmt(delta)))

    if not rows:
        problems.append("the result holds no case")

    lines = [
        f"Claude Code {result.get('claudeVersion', '?')}, {result.get('durationSeconds', 0) // 60} minutes, "
        f"${result.get('costUsd', 0):.2f}",
        "",
        "| Case | With | Without | Delta |",
        "|---|---|---|---|",
        *(f"| {name} | {score} | {without} | {delta} |" for name, score, without, delta in rows),
    ]
    if problems or notes:
        lines += ["", *(f"- FAIL: {p}" for p in problems), *(f"- NOTE: {n}" for n in notes)]
    report = "\n".join(lines)
    print(report)

    summary = os.environ.get("GITHUB_STEP_SUMMARY")
    if summary:
        with open(summary, "a", encoding="utf-8") as f:
            f.write("## Eval result\n\n" + report + "\n")

    return 1 if problems else 0


if __name__ == "__main__":
    sys.exit(main())
