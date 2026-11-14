<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# Coverage sub-agent

The coverage audit is a **read-only** sub-agent that checks whether a `UC-XXX` or `TC-XXX` is completely implemented
and completely tested. There are two kinds of it:

- **`aiup-core/agents/uc-coverage-layered.md`** — the agent of every project that combines layer plugins, and the
  one that is maintained. It has no marker table of its own: it reads the Markers table of
  `docs/architecture/stack.md`, in which every layer skill keeps its rows, so the markers it searches for are
  always those of the layers the project actually has. Its front doors are `/use-case-coverage` (a use case) and
  `/test-case-coverage` (a journey), both in `aiup-core`.
- **`agents/uc-coverage.md` of a combined stack plugin** — a copy per stack with a marker table fixed to that stack
  (`@UseCase`, `UC<id>…Test`, `describe('UC-XXX: …')`, `UC<id>…IT` / `TC<id>…IT`), behind that plugin's
  `/coverage-check`. Only the deprecated `aiup-vaadin-jooq` and `aiup-angular-jpa` ship one, and they go with those
  plugins; `aiup-blazor-dotnet` and the deprecated `aiup-nestjs-nextjs` have no audit.

Either agent derives coverage units from the specification (every main success scenario step, alternative flow,
business rule, precondition, postcondition, and every NFR and constraint on its `**Requirements:**` line — for a test
case, the Flow rows, Validation items, and Postconditions), maps each onto code and tests by id marker or domain
vocabulary, and reports gaps, drift, and the justified next `**Status:**` value.

The constraints that hold this design together apply to both and must survive edits:

- **It never writes.** Its `tools:` list is `Read, Grep, Glob`, and the DO NOT section forbids editing files —
  including the specification's `**Status:**` line. A reviewer that fixes its own findings hides them.
- **No `file:line`, no `Covered`.** The evidence rule is what keeps the audit from rubber-stamping the code the
  calling agent has just written.
- **The front doors stay thin and read-only.** `/use-case-coverage`, `/test-case-coverage`, and `/coverage-check`
  are only doors to the agent: argument parsing, delegation, faithful presentation, hand-off. They must never gain
  the ability to close the gaps they report, and they must not restate the agent's checklist — that is how one would
  grow into the combined implement-and-test skill this design deliberately avoids.
- **The HTML page is rendered, not written.** With `html`, the layered front doors pass the report they have just
  presented to `use-case-coverage/scripts/coverage_report.py`, which writes `docs/coverage/<id>.html`. The agent
  stays read-only, and the script only lays the Markdown out — it escapes every character, drops no row, and adds
  no verdict — so the page and the chat cannot disagree. A page written by the model would be a second, unaudited
  rendering of the verdicts. It is the only file a front door writes; the combined plugins' `/coverage-check` has
  no such option.
- **Drift is the user's call, and reruns are compared.** The agent names both fixes for every drift item
  (specification or code) and recommends neither; the front door asks which side is right before offering a
  command, and on a rerun in the same conversation flags verdicts that changed without a change to the
  specification or the evidence files. Guessing the side of a drift fix is what bounced work between
  `/spec-review` and the audit.

**Construction skills hand off; they never run the agent themselves.** In a layered project `/use-case-implement`
hands off to `/use-case-test`, and `/use-case-test` and `/test-case-implement` end with one hand-off line to
`/use-case-coverage UC-XXX` or `/test-case-coverage TC-XXX`, so the audit runs once, after the tests exist. In
`aiup-vaadin-jooq` and `aiup-angular-jpa`, the two combined plugins with an agent, every implementation and testing
skill ends with a `## Coverage Check` section the same way: the
test skills hand off to `/coverage-check UC-XXX`, and `/implement` hands off to its test skill. This is deliberate:
every audit re-reads the specification and the code base and takes minutes, and running it inside the implementation
skill, again inside the test skill, and once more at the front door turned a two-minute construction round into
thirty. One explicit run at the end, in the agent's `both` mode, is the audit that justifies a `**Status:** Tested` —
or, for a test case, `Automated`: the agent suggests a test case only its own statuses, never `Implemented` or
`Tested` (#54). A new construction skill needs the same hand-off; do not add an in-skill audit back.

**Why two kinds.** A combined plugin knows its stack, so its agent carries the markers; a combination of layer
plugins is only known in the project, so the layered agent lives in `aiup-core` and takes the markers from the stack
file. A change to a marker is therefore made in the layer skill's `references/markers.md` (and from there in the
stack file), or, for a combined plugin, in the skill and its agent copy together — and in the Traceability table of
`docs/workflow.md` either way.

Sub-agents are Claude Code-specific and are not part of the Agent Plugins standard; every front door therefore also
tells hosts without sub-agents to run the checklist from the agent file directly.
