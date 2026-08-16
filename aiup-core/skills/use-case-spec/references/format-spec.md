# Use Case Specification — Normative Format

This document is the single normative definition of the use case
specification format shared by the AI Unified Process skills
(`/use-case-spec`, `/reverse-engineer`) and the AI Unified Process Studio
structured editor. The Studio parser
(`UseCaseSpecificationDocument.java`) is the executable reference for the
*structural* rules; the skills add *content* rules on top. The bundled
validator (`scripts/validate_use_case.py`) checks both:

- **ERROR** — the document violates the structural grammar; Studio's
  structured editor cannot open it (it falls back to a plain markdown
  editor and the file is only counted on dashboards if it carries a
  `**Use Case ID:**` line).
- **WARN** — Studio tolerates the document, but it violates the skill
  contract, or Studio rewrites the content on save (lossy tolerance).

## Document structure

One file per use case. Sections in this order (Studio reorders them to
this order on save):

```markdown
# Use Case: <name>

## Overview

**Use Case ID:** UC-XXX
**Use Case Name:** <name>
**Primary Actor:** <role>
**Secondary Actors:** <roles>                    (optional)
**Goal:** <one sentence>
**Status:** <status value>

**Requirements:** [FR-001, FR-002](../requirements.md)   (optional)

## Preconditions

- <bullet items>

## Main Success Scenario

1. <numbered steps, starting at 1, no gaps>

## Alternative Flows

### A1: <flow name>

**Trigger:** <condition> (step N)
**Flow:**

1. <numbered steps>
2. Use case continues at step N. / Use case ends.

## Postconditions

### Success Postconditions

- <bullet items>

### Failure Postconditions

- <bullet items>

## Business Rules

### BR-XXX: <rule name>

<free-text description>
```

## Languages

The structure is identical in English and German; only headings, field
labels, status values and the rule prefix differ. The language is
detected from the document (majority of matching headings/labels; ties
and empty files are English) and preserved on save.

| Element              | English                       | German                  |
|----------------------|-------------------------------|-------------------------|
| Title prefix         | `# Use Case:`                 | `# Use Case:` (same)    |
| Overview             | `## Overview`                 | `## Übersicht`          |
| ID field             | `**Use Case ID:**`            | `**Use-Case-ID:**`      |
| Name field           | `**Use Case Name:**`          | `**Use-Case-Name:**`    |
| Primary actor        | `**Primary Actor:**`          | `**Primärer Akteur:**`  |
| Secondary actors     | `**Secondary Actors:**`       | `**Sekundäre Akteure:**`|
| Goal                 | `**Goal:**`                   | `**Ziel:**`             |
| Status               | `**Status:**`                 | `**Status:**` (same)    |
| Requirements         | `**Requirements:**`           | `**Anforderungen:**`    |
| Preconditions        | `## Preconditions`            | `## Vorbedingungen`     |
| Main scenario        | `## Main Success Scenario`    | `## Hauptablauf`        |
| Alternative flows    | `## Alternative Flows`        | `## Alternativabläufe`  |
| Trigger field        | `**Trigger:**`                | `**Auslöser:**` (reads `**Trigger:**` too) |
| Flow field           | `**Flow:**`                   | `**Ablauf:**`           |
| Postconditions       | `## Postconditions`           | `## Nachbedingungen`    |
| Success subsection   | `### Success Postconditions`  | `### Erfolgsfall`       |
| Failure subsection   | `### Failure Postconditions`  | `### Fehlerfall`        |
| Business rules       | `## Business Rules`           | `## Geschäftsregeln`    |
| Rule prefix          | `BR`                          | `GR` (reads `BR` too)   |

Status values (either language is readable in any document):

| English       | German          |
|---------------|-----------------|
| Draft         | Entwurf         |
| Reviewed      | Geprüft         |
| Approved      | Genehmigt       |
| Implemented   | Implementiert   |
| Tested        | Getestet        |
| Done          | Abgeschlossen   |
| Obsolete      | Obsolet         |

## Structural rules (ERROR level)

1. **Title** — the first non-blank line is `# Use Case: <name>` or an
   id-style title `# UC-XXX: <name>` matching the id grammar
   `[SB]?UC-[A-Za-z0-9_-]+` (so `SUC-`, `BUC-`, `UC-013a`, `UC-2-1` are
   valid ids). Studio rewrites id-style titles to the canonical prefix
   on save.
2. **Overview** — the `## Overview` section must exist and carry the
   five mandatory fields: ID, Name, Primary Actor, Goal, Status.
   Secondary Actors and Requirements are optional.
3. **Status** — the status value must start with one of the values
   above (case-insensitive). Decoration without letters before the
   value and any annotation after it at a word boundary are tolerated:
   `✅ Implemented (2025-07-11)` and `Approved — 🚧 partial` read as
   Implemented and Approved; `In Progress` is invalid.
4. **Preconditions / postcondition subsections** — bullet items
   (`- `). Anything else that is not a placeholder paragraph (see
   tolerances) is unexpected content.
5. **Main Success Scenario** — top-level numbered items (`1. `,
   unindented). Wrapped continuation lines are joined into their item.
6. **Alternative Flows** — each flow is a `### ` heading followed by a
   trigger line (`**Trigger:**` / `**Auslöser:**`), the flow field line
   (`**Flow:**` / `**Ablauf:**`) and at least one numbered step. A flow
   missing any of the three is incomplete. Plain prose inside a flow is
   unexpected content (markup paragraphs are notes — see tolerances).
7. **Business Rules** — each rule is a `### ` heading followed by
   free-text description lines.
8. Any other **plain prose at top level or inside an item section** is
   unexpected content.

## Tolerances (parsed losslessly, no diagnostic)

These come from Studio's pass-through rules (UC-010 BR-011, FR-072) and
tolerant-read rule (UC-020 BR-003); generators should still emit the
canonical form, but validators must accept:

- **Unknown overview lines** (e.g. `**Priorität:** Hoch`) — kept
  verbatim.
- **Extra sections** with their own heading (e.g. `## Suchkriterien`)
  anywhere between template sections — kept verbatim at their anchor.
- **Placeholder paragraphs** — a paragraph entirely in italics (e.g.
  `_None — the page is static._`) standing in for the content of an
  *empty* template section. Next to real content it is unexpected.
- **Flow notes** — markup paragraphs inside an alternative flow
  (starting `**`, `_`, `*` or `>`) before the trigger, between trigger
  and flow field, or after the steps. They are read as the note of the
  flow; a note never substitutes for trigger or steps.
- **Decorated status values** as described above.
- **`**Trigger:**` in German documents** (written back as
  `**Auslöser:**`).
- **`BR-` rule labels in German documents** (written back as `GR-`).
- **Wrapped lines** — joined into the item above.

## Normalized on save by Studio (WARN level)

Studio rewrites these without asking; a generator that produces them
creates diffs on the first Studio save:

- **Sub-bullets nested under a step or bullet item** are flattened —
  joined into the parent line. Do not nest lists inside steps.
- **Step, flow (`A1`…) and rule (`BR-001`…) numbers are positional**:
  Studio renumbers them gaplessly on save.
- **Section order** is normalized to the template order.

## Skill contract (WARN level)

The `/use-case-spec` skill additionally requires:

- All five template sections and both postcondition subsections exist.
- The use case id matches `[SB]?UC-[A-Za-z0-9_-]+` and the filename
  starts with the id (canonical: `UC-XXX-<kebab-case-name>.md`).
- The main scenario has steps numbered `1..n` without gaps.
- At least one alternative flow; each trigger names its main-scenario
  step as `(step N)` / `(Schritt N)`; each flow's last step ends with
  `Use case continues at step N.` or `Use case ends.` (German: `Der Use
  Case wird bei Schritt N fortgesetzt.` / `Der Use Case endet.`).
- Success and failure postconditions are non-empty (an explicit italic
  placeholder such as `_None — …_` counts as a deliberate statement).
- Business rule headings carry a `BR-XXX:` / `GR-XXX:` label, numbered
  `BR-001`, `BR-002`, … without gaps within the document.
- No implementation-level terms in steps (SMTP, email server, JWT,
  token, bcrypt, hash, salt, SHA, SQL, SELECT, INSERT).

### Business-rule id scope

`BR-XXX` ids are **scoped to their use case**: every document numbers
its rules from `BR-001`, and the same id may appear in other documents.
This matches Studio, which renumbers rules per document on save. A rule
referenced from another document is qualified with the use case id
("UC-005 BR-002"), never by the bare rule id.

## Validation

```bash
python3 scripts/validate_use_case.py [--strict] docs/use_cases/UC-*.md
```

Exit 0 when clean; 1 on any ERROR (with `--strict` also on any WARN);
`--self-test` runs the built-in fixtures. Newly generated documents must
pass `--strict`. Pre-existing hand-written documents must at minimum be
ERROR-free, or Studio cannot open them in the structured editor.
