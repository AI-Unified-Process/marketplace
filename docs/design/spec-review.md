<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# Spec review

`/spec-review` has two parts, and the split is the design:

- **Part A, `skills/spec-review/scripts/spec_lint.py`** — deterministic, Python standard library only, the only
  part that may fail a build. It checks what connects the documents (diagram ↔ spec files, unique ids, resolving
  `FR-`/`UC-xxx BR-yyy`/TC/process references, FR coverage, requirement status against the linking use cases, BPMN
  activity mapping, a use case's actors against the diagram's links, copied rule text, weak words, glossary Avoid
  synonyms) plus a baseline file (`docs/.spec-lint-baseline.json`) for brownfield projects.
  It does **not** copy the per-file checks or the BPMN parser: it imports `validate_use_case.py` and
  `bpmn_paths.py` at runtime from the sibling skill folders by glob (`*use-case-spec/`, `*test-case/`, host prefixes
  allowed) and reports an INFO finding when one is missing. Keep one copy of each script.
  `--trace` prints the traceability matrix (requirement → use case → business rules → test cases, test case →
  process → use cases) and a requirement coverage summary (linked → in a test case → Verified, with the gaps by
  id) from the same parsed documents instead of findings; `--report` prints all of it plus the findings as one
  self-contained HTML page. The script writes no file; `/spec-review report [ID]` redirects `--report` into
  `docs/spec-report.html`. `--impact ID...` walks the same graph transitively from a change (requirement → use
  cases → citing, including, and extending use cases → processes → test cases, requirement → ADRs) and prints each
  affected element with its shortest trace. Edges back up (use case → its requirements, process → its use cases,
  ADR → its requirements) count only from a changed element; otherwise one change would reach the whole catalog.
  `/spec-review impact` adds the untraced, advisory part and the hand-offs, so change impact analysis needs no skill
  and no parser of its own.
- **Part B, the SKILL.md with `references/review-checklist.md`** — the agent's semantic review (contradictions,
  reworded duplicates, wrong level, completeness, testability, ambiguity, entity-model consistency, trigger and
  preconditions, actors, missing NFR and constraint references). Its findings are
  `warning`/`info` only and never block.
- **Converges.** The verdict states **Ready for Approved** (lint exit 0, no open semantic warning); `info`
  findings get no fix command, and a repeated run in the same conversation reports what changed since the last one
  instead of a fresh list. Without this, every fix is followed by a review that finds the next thing.
- **Read-only.** Like `/coverage-check`, the skill never edits a specification, the glossary, or the baseline; the
  only file it writes is the generated page `docs/spec-report.html`, on `/spec-review report` alone. It
  hands off to `/use-case-spec`, `/requirements`, `/use-case-diagram`. It stays in `aiup-core` because it reads only
  `docs/`; comparing specifications with code is `/use-case-coverage` (layer plugins) or a combined stack's
  `/coverage-check`.

The glossary (`docs/glossary.md`, columns `Term | Definition | Avoid`) is written by `/requirements` from the
template `skills/requirements/references/glossary.md`; `/use-case-spec` and `/reverse-engineer` use its terms.
Business rules stay numbered per use case, so "defined once" means no rule text copied between use cases, not
globally unique rule ids. There is deliberately no syntax for entity references in use cases; entity consistency
is judged from context in Part B.
