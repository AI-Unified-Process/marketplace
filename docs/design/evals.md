<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# Eval scenarios

Each plugin's scenarios can be published with it, and the Tessl registry then runs them to compute the Impact
score (see *Running the scenarios without Tessl* for when they are not). The scenarios are also the only regression tests the skills have, so they exist for the maintainers as much
as for the score (#47).

The scenarios live in `evals/<plugin>/` at the repository root, not in the plugin folder. The Claude directory
submits a plugin folder alone, and its validation refuses what the fixtures hold: `.puml` files, a `package.json`
with scripts, and more than 2,000 files in `aiup-core`. When it uploads them, the Tessl publish workflow copies
`evals/<plugin>/` to `<plugin>/evals/` in the runner before it publishes, so the registry gets the scenarios with the
plugin.

- **At least two scenarios per core skill.** The first covers the main path. The second covers one rule that is
  easy to break, such as `/architecture-decision` refusing an ADR without an NFR or constraint, the spec lint
  baseline on a rerun, or `/acceptance-protocol` keeping a use case at `Tested`. A skill with one scenario can lose
  that rule without anyone noticing.
- **Real layer skills, not stubs.** Tessl installs only the plugin under test. A core scenario that runs
  `/use-case-implement`, `/use-case-test`, or a coverage audit therefore ships the layer skills under
  `layer-skills/<skill>/` and the coverage agent under `agents/`. These used to be trimmed stubs written by hand.
  They drifted: the `@UseCase` markers lacked `requirements`, and the agent lacked module paths and open questions.
  So the scenarios graded contracts that no longer existed. The fixtures are now exact copies.
  `scripts/sync-eval-fixtures.sh` writes them, and its `--check` fails CI when a skill changes without its copies.
  Real copies make each run longer and use more tokens. The registry should measure what users install.
- **Seeded stack files follow the template.** A scenario's `docs/architecture/stack.md` is project content, but it
  aged the same way: an old header, no `**E2E scope:**` line, marker rows from older markers references (#58).
  `scripts/sync_eval_stack_files.py`, run by `sync-eval-fixtures.sh`, keeps the parts the template and the layer
  skills dictate. A missing E2E scope becomes `Use cases and test cases`, how the skills read a file without the
  line, so no scenario changes behaviour. A skill's rows are refreshed only where the file already has them, because
  a layer-skill scenario may expect the skill to add them. The rows of the skill a scenario is named after are left
  alone, because that scenario may seed them outdated on purpose.
- **Every rubric totals 100 points.** The check fails CI otherwise, so the scores stay comparable.
- **One end-to-end chain per typical stack.** The rules that hold the layered design together live between skills:
  the Handover, the integration layer lookup, the E2E scope, the BR markers, and the `**Layers:**` line. A scenario
  for a single skill cannot break them. `use-case-implement-chain-vaadin-flow-jooq` and
  `use-case-implement-chain-rest-jpa` each run implement, test, and coverage in one task and grade the files left
  behind.
- **The grader sees files, not the conversation.** A criterion about what the agent said (a report, a Handover, a
  hand-off) works only because the task asks for every message in `session-log.md`.

## Running the scenarios without Tessl

The Tessl publish-time eval counts against the Tessl subscription, so the publish workflow uploads the scenarios only
when the repository variable `TESSL_PUBLISH_EVALS` is `true`. Without it, the plugins are published without
scenarios and the maintainers run them with `claude plugin eval`, on their own Claude plan or API key.
`evals/<plugin>/` stays the single source; `scripts/tessl_to_plugin_evals.py` writes generated cases to
`build/plugin-evals/` (not committed). How to run them, locally or with the workflow **Run evals**:
[Running the evals](../evals.md).

- The eval runs against the repository root, because every plugin a case loads must lie under the directory the
  eval runs against.
- Each checklist item becomes one `llm` grader with `max_score` as its weight; the run also measures the same task
  without the plugins (the delta Tessl calls Impact).
- `claude plugin eval` loads no `.claude/skills` or `.claude/agents` from the workspace. The converter therefore
  loads the real plugins that own the skills under `layer-skills/` and the agents under `agents/` instead of the
  copies.
- An `llm` grader reads one file. A criterion that names several files is judged on the first one, criteria about
  what the agent said on `session-log.md`; the converter lists the graders that leave files unchecked. This fits
  the scenarios of a single document skill well. For the chain and code scenarios the score is an indication,
  not a measure: a criterion about the code may be judged from what the agent reported.
- **No file to judge, no grader.** The converter used to fall back to the agent's last message (356 of 1,015 llm
  graders) or the log (196 more) when a criterion named no file. The first full run (2026-11-24) failed good entity
  models that way: the judge saw a summary, never `docs/entity_model.md`. A missing grader is listed and shows how much
  of the rubric is unmeasured; a wrong one only looks like a measurement.
- **Hand graders** close that gap where a criterion is about code. A scenario may hold `graders/<name>.md` in the
  `claude plugin eval` format with one extra line, `criterion: "<checklist item name>"`; they replace the generated
  grader of that item, and their weights add up to its points (`tessl_to_plugin_evals.py --check`, run by
  `sync-eval-fixtures.sh`). Most are `regex` graders on the `trace`, anchored on one tool call of the agent:
  `"name":"(Write|Edit|Bash)","input":{` followed by the file name and the pattern on the same line. The anchor
  matters three ways. The trace also holds the skill files the agent read, and their examples carry the same
  markers, so an unanchored pattern passes on its own. The agents write most code through `Bash` heredocs, not
  `Write`, so a `tool_used` grader on `Write` misses it (the chain scenarios scored 0.46 and 0.70 that way). And the
  agent's messages to `session-log.md` name files and rules too, so the anchor excludes calls that write the log. A
  `regex` grader on a file cannot help: its path takes no glob, and the package of the generated code varies.
  `file_exists` checks that a test class exists or does not; it also counts files a `Bash` call created. The
  patterns read JSON-encoded content: a newline is `\n`, a quote `\"`. Hand graders cost no judge call and give the
  same verdict every run. `criteria.json` stays the rubric, so a hand grader checks what its criterion says and
  nothing else.
- `--format skill-evals` writes the same scenarios as Agent Skills `evals.json`
  ([evaluating skills](https://agentskills.io/skill-creation/evaluating-skills)), with the points as `weights`.

Measured on 2026-11-23, one run each, with and without the plugins: `open-questions-record-answer-list` 1.0 and 0.2
(4 minutes, $0.54); `use-case-implement-chain-rest-jpa` 0.97 and 0.51, `use-case-implement-chain-vaadin-flow-jooq`
0.96 and 0.48 (32 minutes with `-j 1`, $10.05). Each chain lost points only on an llm grader over `session-log.md`; both
are now regex graders on that file. They score 1.0 and 0.98 on the kept logs: the Vaadin run reported no Handover
block, which the judge had rightly failed, while the REST judge had failed lines that were there. Two earlier attempts
with `-j 4` and `-j 2` hung after 6 to 10 minutes in API retries without an error status until the one-hour timeout,
and `claude plugin eval` still exited 0, so a run is valid only when no run in the JSON result has an `error`;
`scripts/check_plugin_eval_result.py` checks that, and the workflow **Run evals** decides on it, not on the exit code.

The first full run of `aiup-core` on GitHub (2026-11-24) ran on `ubuntu-26.04`, where every shell command of the agents
failed: Ubuntu's AppArmor profile `bwrap-userns-restrict` takes the capabilities Claude Code's sandbox helper needs,
whatever the user namespace sysctl says. The workflow unloads the profile and nests a namespace itself before the eval,
so a broken sandbox stops the job instead of lowering scores. Scores of that run count for nothing.

Both chains had written no Handover block at all: nothing in `/use-case-implement` said to write it out. With that
sentence added (aiup-core 3.21.4), both scored 1.0 with every Handover in the log (34 minutes, $8.17); the REST chain
scored 0.535 without the plugins. The Vaadin run without the plugins ended on an API error and counts for nothing.
