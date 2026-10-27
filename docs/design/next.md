<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# Next step

`aiup-core` has many skills across the four phases, and each one is consistent on its own. A new user still has a
hard time knowing which command comes next: the stack file, decision rights, open questions, ADRs, markers, and the
Transition skills all made the path longer (#46). `/next` reads the project state and names the next command with
its reason. (It has nothing to do with the AI Unified Process Navigator, the IDE plugin that links tests to use case
specifications.)

- **A mode of `spec_lint.py`, not a new parser.** `spec_lint.py` already reads every artifact the decision needs:
  requirements, the diagram, use case and test case statuses, open questions, ADRs, and the lint findings after the
  baseline. `--next` reuses it and adds only three readers: the Layers and `## External systems` tables of
  `docs/architecture/stack.md`, the anchors of `docs/user_guide/` (with `guide_anchor.py` of `/user-guide`, imported
  by glob like the other sibling scripts), and the latest Git tag with the use cases at that tag. The skill is thin,
  like `/spec-review`: it picks the construction commands, runs the script, and presents the result.
- **The script orders, not the agent.** The same state gives the same next step on every run. An agent that ranks
  the steps itself would give a different answer to the same question, and a guide that is not reliable is not
  used.
- **Earlier phase first; in Construction, the use case closest to `Done` first.** Missing requirements, a missing
  entity model or diagram, and uncovered functional requirements come before any construction step, because every
  later step reads them. Inside Construction, blocking questions and lint errors come first, because they stop the
  steps after them. Then the use cases, from `Implemented` down to a missing specification: work that has started is
  finished before new work begins, which keeps the work in progress small. Transition comes last. The ADR row is
  advice and comes after everything else, because the script cannot tell whether an NFR or constraint asks for a
  decision.
- **One or two `Next:` lines.** A full list of pending steps is a backlog, and the backlog belongs to the team's issue
  tracker (`docs/workflow.md`). The text output shows the next step and the one after it; `--format json` and
  `/next all` list every pending step for the user who asks.
- **What the baseline accepts is no next step.** An uncovered functional requirement, a missing specification, or a
  lint error that the team accepted into `docs/.spec-lint-baseline.json` does not come back as a step.
- **Read-only.** Like `/spec-review` and the coverage audits, `/next` never runs the next command and writes no file.
  It reads Git (`describe`, `ls-tree`, `show`) and never changes the Git state. The Studio never runs it: a run that
  changes nothing has no result to propose.
- **Combined stack plugins.** A project uses layer plugins or one combined stack plugin. The script cannot see which
  plugins are installed, but the agent can: the skill passes `--stack-plugin` when a combined plugin's `/implement`
  is available, and the script then uses that plugin's commands and drops the `/stack` steps.
- **Careful signals.** A secondary actor without a row under `## External systems` may be a person or a role, so the
  step says "if it is a system our system calls", and a name that is a primary actor elsewhere is skipped. A test case
  is offered for automation only when every use case it chains is implemented and the stack has an E2E layer. Release
  notes changed since the tag belong to the next version, so `/release-notes` is not offered again.
