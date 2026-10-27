<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# Eval scenarios

Each plugin's `evals/` folder is published with it, and the Tessl registry runs the scenarios to compute the Impact
score. The scenarios are also the only regression tests the skills have, so they exist for the maintainers as much
as for the score (#47).

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
- **One end-to-end chain per typical stack.** The rules that hold the layered design together live between skills:
  the Handover, the integration layer lookup, the E2E scope, the BR markers, and the `**Layers:**` line. A scenario
  for a single skill cannot break them. `use-case-implement-chain-vaadin-flow-jooq` and
  `use-case-implement-chain-rest-jpa` each run implement, test, and coverage in one task and grade the files left
  behind.
- **The grader sees files, not the conversation.** A criterion about what the agent said (a report, a Handover, a
  hand-off) works only because the task asks for every message in `session-log.md`.
