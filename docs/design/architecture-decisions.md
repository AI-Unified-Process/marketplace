<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# Architecture decisions

`/architecture-decision` (#39) writes architecture decision records — the first skill that writes into the team's
architecture documentation, and only on the user's request. The name follows the core's full-word nouns
(`requirements`, `open-questions`); `/adr` would be the only abbreviation and a generic name that clashes with other
ADR skills on Tessl or in `~/.claude/skills`. Its description triggers on "ADR".

- **Every ADR links an `NFR-` or a `C-`** in a `**Requirements:**` line (the label of the use cases, so
  `spec_lint.py` reads it the same way). A decision is justified by a quality or a constraint, never by a feature
  alone; the link is what makes a changed NFR or constraint show the decisions to revisit. When the reason is not in
  the requirements, the skill writes nothing and hands off to `/requirements` first, instead of recording an ADR
  without one.
- **One owner of the format, the team's format kept.** Template `references/adr.md` (not copyright-stamped):
  `**Status:**`, `**Date:**`, `**Requirements:**`, `**Supersedes:**`/`**Superseded by:**`, Context, Decision,
  Consequences. A project with MADR or Nygard ADRs keeps its format and gets the lines added. Location: the existing
  ADR folder, default `docs/architecture/decisions/` — plural and in full words like `use_cases/`, `test_cases/`,
  and `processes/`; every reader also finds `adr/` and `adrs/` (adr-tools, Log4brains, existing projects) and globs
  `docs/**/{decisions,adr,adrs}/*.md`.
- **Statuses** `Proposed`, `Accepted`, `Superseded`, `Deprecated`, `Rejected`. Only `Accepted` ADRs are followed by
  `/stack`, `/use-case-implement`, and (through it) the layer skills, and by the `/implement` skills of the combined
  stack plugins and `/angular-ui`, which read the three folders themselves; an accepted ADR is never rewritten, a
  changed decision supersedes it.
- **No other skill writes an ADR; three hand off.** `/stack` names the choices of its question round that no
  constraint or accepted ADR fixed, `/use-case-implement` names an answered architecture question (new dependency,
  deviation from an ADR), `/requirements` names the ADRs linking an NFR or constraint it changed. The "never changes
  an ADR" rule of the decision rights stays.
- **Lint.** `DANGLING_REF` and `DUPLICATE_ID` cover ADR ids and their links (ERROR); `ADR_UNLINKED`, `ADR_STALE`,
  `ADR_INVALID` are WARN only, because the ADRs are the team's documents and a brownfield ADR without the line must
  not fail CI. `--trace` and `--report` list the ADRs with their requirements. Part B checks contradicting accepted
  ADRs and broken constraints.
- The Studio never runs it (`LEFT_OUT`): a decision needs a person.
