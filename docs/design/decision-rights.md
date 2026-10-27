<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# Decision rights

`/use-case-implement` (#42) sorts the decisions of construction into three sections — *The agent decides alone*,
*The agent asks first*, *The agent never* — so the line between a specification gap and an implementation choice is
explicit and a team can move it.

- **Defaults and template in one file.** `skills/use-case-implement/references/decision-rights.md` is both the
  defaults and the template `/stack` copies to `docs/architecture/decision-rights.md` on request; it is not
  copyright-stamped. `/stack` never asks whether to create the file: the defaults apply without it, so the question
  has no answer to wait for, and an unanswered question stalled unattended runs (#56). Its report names the defaults
  instead. The section "Decision Rights" of `/use-case-implement` owns how the rules apply; the layer
  skills, `/use-case-test`, and `/test-case-implement` refer to it and must not copy it.
- **The project file replaces the first two sections; "never" only grows.** A rule of the defaults' "never"
  section applies whatever the project file says, and the skill reports a project file that moved one. The file
  sorts decisions; it grants nothing outside the task. A decision no rule names is asked first.
- **Only specification questions go to `docs/open-questions.md`.** A new library or dependency and a deviation from
  an ADR are asked first too, but they have no element of the specification, so they are asked and listed in the
  report's **Open questions** without an `OQ-` id. Adding an `Architecture:` element form was rejected: the answer
  lands in an ADR or the build, never in the specification, so the question could never be `Resolved`.
- **Decisions are reported.** The implementation and test reports list the decisions taken alone under
  **Decisions** — the choices a reviewer would otherwise dig out of the diff, not every name.
- The combined stack plugins are not part of it: they keep their own `/implement` rules.
