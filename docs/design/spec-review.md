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
  and no parser of its own. `--next` prints the project state and the next command for `/next`; see
  [Next step](next.md).
- **Part B, the SKILL.md with `references/review-checklist.md`** — the agent's semantic review (contradictions,
  reworded duplicates, wrong level, completeness, testability, ambiguity, entity-model consistency, trigger and
  preconditions, actors, missing NFR and constraint references). Its findings are
  `warning`/`info` only and never block.
- **Converges.** The verdict states **Ready for Approved** (lint exit 0, no open semantic warning); `info`
  findings get no fix command, and a repeated run in the same conversation reports what changed since the last one
  instead of a fresh list. Without this, every fix is followed by a review that finds the next thing.
- **Read-only.** Like the coverage audit, the skill never edits a specification, the glossary, or the baseline. It
  writes two generated files and nothing else: the page `docs/spec-report.html`, on `/spec-review report` alone, and,
  when the caller passes `--output <file>`, the semantic findings and the verdict as JSON in the file the caller
  names, which must lie outside `docs/` (the Studio passes `.aiup-report/review.json` to show the review in its
  log). The lint findings are not in it; the caller runs `spec_lint.py --format json` itself. It
  hands off to `/use-case-spec`, `/requirements`, `/use-case-diagram`. It stays in `aiup-core` because it reads only
  `docs/`; comparing specifications with code is `/use-case-coverage` (layer plugins) or a combined stack's
  `/coverage-check`.

A link is not evidence, so the coverage does not treat it as such. An `Obsolete` test case verifies nothing and does
not count. An NFR or constraint no use case links is listed as system-wide, outside the count: the lint calls that
fine, so a coverage figure that counts it as a gap could never reach 100 %. `UC_NO_REQUIREMENT` is the way back up,
a use case nothing justifies, and only INFO because `/reverse-engineer` writes such use cases.

`SPEC_CHANGED_AFTER_STATUS` covers the other way evidence decays: `Verified` is derived from a status, and a status
says nothing about text written after it. The commit that gave the use case its current status stands for the moment it
was set, because no other date exists; a stamp in the specification would be one more thing to maintain. The history
is followed across a move: a commit that only moves the file into a module folder adds the `**Status:**` line at the
new path without setting anything, so the last commit touching that line would forget every change made before the
move. So the check
needs Git and finds nothing without history, never a false alarm. It stays WARN, and it never sets a status back:
a change may be wording only, and that is for a person to judge. Value columns of the catalog do not count, because a
new priority changes nothing a test verifies. The message carries a digest of the text, so a baseline entry accepts
this state and not every later one. Test results stay out: reading them would tie a stack-agnostic script to each
stack's report format (see #43).

The glossary (`docs/glossary.md`, columns `Term | Definition | Avoid`) is written by `/requirements` from the
template `skills/requirements/references/glossary.md`; `/use-case-spec` and `/reverse-engineer` use its terms.
Business rules stay numbered per use case, so "defined once" means no rule text copied between use cases, not
globally unique rule ids. There is deliberately no syntax for entity references in use cases; entity consistency
is judged from context in Part B.
