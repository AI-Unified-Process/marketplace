<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# Coverage sub-agent

`aiup-vaadin-jooq/agents/uc-coverage.md` defines the `uc-coverage` sub-agent: a **read-only** auditor that checks
whether a `UC-XXX` or `TC-XXX` is completely implemented and completely tested. It derives coverage units from the specification
(every main success scenario step, alternative flow, business rule, precondition, postcondition, and every NFR and
constraint on its `**Requirements:**` line — for a test case, the
Flow rows, Validation items, and Postconditions), maps each onto code and tests by id marker (`@UseCase`,
`UC<id>…Test`, `UC<id>…ServiceTest`, `describe('UC-XXX: …')`, `UC<id>…IT` / `TC<id>…IT`) or domain vocabulary, and
reports gaps, drift, and the justified next `**Status:**` value.

Three constraints hold this design together and must survive edits:

- **It never writes.** Its `tools:` list is `Read, Grep, Glob`, and the DO NOT section forbids editing files —
  including the specification's `**Status:**` line. A reviewer that fixes its own findings hides them.
- **No `file:line`, no `Covered`.** The evidence rule is what keeps the audit from rubber-stamping the code the
  calling agent has just written.
- **`/coverage-check` stays thin and read-only.** `skills/coverage-check/SKILL.md` is only a front door to the agent:
  argument parsing, delegation, faithful presentation, hand-off. It must never gain the ability to close the gaps it
  reports, and it must not restate the agent's checklist — that is how it would grow into the combined
  implement-and-test skill this design deliberately avoids.
- **Drift is the user's call, and reruns are compared.** The agent names both fixes for every drift item
  (specification or code) and recommends neither; `/coverage-check` asks which side is right before offering a
  command, and on a rerun in the same conversation flags verdicts that changed without a change to the
  specification or the evidence files. Guessing the side of a drift fix is what bounced work between
  `/spec-review` and `/coverage-check`.

All six implementation and testing skills of this plugin end with a `## Coverage Check` section and a final workflow
step that **hands off** — they never run the agent themselves. The four test skills hand off to
`/coverage-check UC-XXX`; `/implement` and `/implement-hilla` hand off to their test skill (`/browserless-test`,
`/hilla-test`), so the audit runs once, after the tests exist. This is deliberate: every
audit re-reads the specification and the code base and takes minutes, and running it inside `/implement`, again
inside the test skill, and once more in `/coverage-check` turned a two-minute construction round into thirty. One
explicit run at the end, in the agent's `both` mode, is the audit that justifies a `**Status:** Tested`. A new
construction skill needs the same hand-off section; do not add an in-skill audit back.

The agent lives in this plugin, not in `aiup-core`, and its marker table describes this stack only; another stack
plugin that wants the same check needs its own copy with its own markers (`aiup-angular-jpa` has one). Sub-agents are Claude Code-specific and are
not part of the Agent Plugins standard; `/coverage-check` therefore also tells hosts without sub-agents to run the
checklist from the agent file directly.
