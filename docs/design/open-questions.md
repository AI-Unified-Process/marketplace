<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# Open questions

`docs/open-questions.md` (#41) is the persistent log of specification gaps: one `## OQ-XXX: <question>` section per
question with `**Element:**`, `**Raised by:**`, `**Blocking:**`, and `**Status:**` lines (`Open` → `Answered` →
`Resolved`, or `Withdrawn`). It supersedes the part of #29 that rejected a central status file, because it is a log
of questions, not a second maturity record: the `**Status:**` line of the use case stays the truth, and a question
ends at `Resolved` once its answer is in the specification.

- **One owner of the format.** `/open-questions` defines the section, the Element forms (`UC-003 step 4`,
  `UC-003 A2`, `UC-003 BR-002`, `FR-014`, `Glossary: <Term>`, `Entity: BOOK.isbn`), and the statuses; every other
  skill says "in the format of `/open-questions`" and locates it by glob. Its template
  `references/open-questions.md` is not copyright-stamped. Sections, not a table: a table cannot hold the readings
  and multi-sentence answers, and its diffs and merge conflicts are unreadable.
- **One file, created lazily.** No file per module (the element names the module), and nobody creates an empty
  one; a missing file means no questions for every reader.
- **Who writes what.** Construction and test skills (`/use-case-implement`, the layer skills, `/use-case-test`,
  the combined `/implement`) append sections only — the one exception to "never edit `docs/`" besides the Markers
  table. A part left out is `Blocking: Yes`; a reading the user chose is recorded `Answered`. `/use-case-spec`,
  `/requirements`, and `/entity-model` resolve the answered questions on their own elements, ask the open ones in
  their clarify step, record every default they took without asking as `Open` with an `**Assumed:**` line, and
  withdraw questions whose element they removed. Only they set `Resolved`. `/spec-review` and the coverage agents
  read the file and never write it.
- **Blocking.** An `Open` or `Answered` blocking question blocks the use case its element names and every use case
  linking the requirement it names. `spec_lint.py` reports `OQ_BLOCKING` as WARN at `Approved`/`Implemented` and
  as ERROR at `Tested`/`Done` — an ERROR at `Approved` would fail CI as soon as implementation records a gap, and no
  skill may change the status line. `/use-case-implement` asks before going ahead; when no one can answer, it
  leaves out only the elements the question is about. The coverage agents never suggest `Tested` past one.
- **History is not checked.** `DANGLING_REF` covers only `Open` and `Answered` questions; `Resolved` and
  `Withdrawn` ones may point to renumbered elements.
- The Studio never runs `/open-questions` (`LEFT_OUT` of `check-generate-catalogue.sh`); `spec_lint.py --report`
  lists the open questions instead.
