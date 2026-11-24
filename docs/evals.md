<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# Running the evals

For maintainers. Each plugin has eval scenarios in `evals/<plugin>/<scenario>/`: a task (`task.md`), a fixture
project, and a rubric (`criteria.json`, 100 points). Run a plugin's scenarios after changing one of its skills, to see
whether the skill still does what the rubric asks, and how much better than an agent without the plugins.

They run with `claude plugin eval` of Claude Code, on your own Claude plan or API key. Nothing runs them on a push:
each scenario is a full agent session, and a construction chain scenario costs about $4 with the baseline. Tessl runs
them at publication only when the repository variable `TESSL_PUBLISH_EVALS` is `true`.

## In GitHub Actions

Start the workflow **Run evals** (`.github/workflows/run-evals.yml`) under *Actions → Run evals → Run workflow*. It
needs the repository secret `ANTHROPIC_API_KEY`.

| Input          | Default           | Meaning                                                                            |
|----------------|-------------------|------------------------------------------------------------------------------------|
| `plugin`       |                   | The plugin whose scenarios run                                                     |
| `cases`        | all               | A name glob, such as `use-case-implement-chain-*` or `open-questions-*`            |
| `runs`         | `1`               | Runs per scenario and arm; use 3 to tell a change from noise                       |
| `min_score`    | `0.8`             | A scenario below this score with the plugins fails the job                         |
| `max_cost_usd` | `20`              | No new run starts once the estimate reaches it; the job then fails as partial      |
| `model`        | `claude-opus-5-5` | The model of the agent under test; keep it fixed to compare runs                   |
| `ablation`     | `with-without`    | `none` skips the runs without the plugins and halves the cost, but gives no delta  |

The job summary shows the table of scores. The artifact `eval-<plugin>-<run>` holds `eval-result.json` and the HTML
report with every grader's verdict.

`aiup-core` has 52 scenarios; run it with a `cases` glob, not as a whole. The other plugins have 1 to 15.

## On your machine

Claude Code 2.1.330 or later, from the repository root:

```sh
python3 scripts/tessl_to_plugin_evals.py aiup-core
claude plugin eval . --eval-dir build/plugin-evals/aiup-core/evals --case 'open-questions-*' \
  --scaffold --trust-plugin --allow-tools Write Edit Bash \
  --runs 1 -j 1 --threshold 0.8 --no-publish --max-cost-usd 5 --json build/eval-result.json
python3 scripts/check_plugin_eval_result.py build/eval-result.json --min-score 0.8
```

- The first command writes the cases to `build/plugin-evals/` (never committed). Rerun it after changing a scenario.
- The eval runs against `.`, the repository root, because every plugin a case loads must lie under its target.
- `--scaffold` runs each case's `fixture.sh`, which copies the fixture project into the workspace.
- Keep `-j 1`. Parallel runs have hung in API retries until the one-hour timeout.
- Leave out `--json` to watch progress and see each grader's verdict in the terminal. `--keep-temp` keeps the
  workspaces, to look at what the agent wrote.

## Reading the result

`check_plugin_eval_result.py` prints one row per scenario: the score with the plugins, without them, and the
difference. It fails when:

- a scenario scored below the minimum with the plugins;
- a run with the plugins ended on an error (a timeout, an API error): its score counts for nothing;
- the cost ceiling stopped the run, or skipped the llm graders of a run.

A run *without* the plugins that ended on an error makes that baseline invalid; the table shows `–` and a note, and
the job still passes. Do not trust the exit code of `claude plugin eval` alone: runs that hung until their timeout
ended with exit 0.

A low score has two causes: the skill, or the grader. Open the HTML report, or run the scenario locally without
`--json`, and read the failed graders before changing the skill. An `llm` grader judges one file; criteria about code
are judged more reliably by hand graders.

## Changing a scenario

- `evals/<plugin>/` is the only source. Never edit `build/plugin-evals/`.
- A criterion about code gets hand graders in `evals/<plugin>/<scenario>/graders/`: `claude plugin eval` grader
  files with a `criterion:` line that names the checklist item; their weights add up to its points.
- `scripts/sync-eval-fixtures.sh --check` validates the hand graders, the rubric totals, and the copies of the layer
  skills; CI runs it.
- A new plugin folder under `evals/` is also added to the `plugin` choice of `run-evals.yml`; the same check fails
  otherwise.

Why the scenarios look the way they do, how the converter maps them, and how hand graders are anchored:
[eval design](design/evals.md).
