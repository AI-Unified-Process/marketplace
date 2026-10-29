---
name: requirements
description: >
  Gathers, organizes, and documents software requirements into structured
  catalogs with functional requirements (user stories), non-functional
  requirements (measurable quality attributes), and constraints. Use when
  the user asks to "write requirements", "create a PRD", "gather requirements",
  "document feature specs", "write user stories", "define NFRs", "list
  constraints", "write a glossary", "define domain terms", or mentions
  requirements catalog, requirements analysis, product requirements document,
  feature specification, or glossary.
---

<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# Requirements

## Instructions

Create or update the requirements catalog at `docs/requirements.md` based on `docs/vision.md`.
The document contains functional requirements, non-functional requirements, and constraints organized as Markdown
tables. Alongside it, create or update the glossary at `docs/glossary.md` (see [Glossary](#glossary)).

## DO NOT

- Mix requirement types in a single table
- Skip the user story format for functional requirements
- Use duplicate IDs across requirement types
- Leave the Status column empty

## Requirement Types

### Functional Requirements (FR)

Define what the system should do. Always use the user story format:

**Format:** As a [role], I want [goal] so that [benefit].

| ID     | Title        | User Story                                                                                | Priority | Status |
|--------|--------------|-------------------------------------------------------------------------------------------|----------|--------|
| FR-001 | Create Task  | As a project manager, I want to create tasks so that I can track work items.              | High     | Open   |
| FR-002 | Assign Task  | As a project manager, I want to assign tasks to team members so that work is distributed. | High     | Open   |
| FR-003 | Filter Tasks | As a team member, I want to filter tasks by status so that I can focus on relevant items. | Medium   | Open   |

### Non-Functional Requirements (NFR)

Define quality attributes. Must be measurable.

| ID      | Title            | Requirement                                                   | Category     | Priority | Status |
|---------|------------------|---------------------------------------------------------------|--------------|----------|--------|
| NFR-001 | Response Time    | All page loads must complete within 2 seconds.                | Performance  | High     | Open   |
| NFR-002 | Availability     | System must maintain 99.9% uptime during business hours.      | Availability | High     | Open   |
| NFR-003 | Concurrent Users | System must support 100 concurrent users without degradation. | Scalability  | Medium   | Open   |
| NFR-004 | Data Encryption  | All data in transit must use TLS 1.3 encryption.              | Security     | High     | Open   |

### Constraints (C)

Define limitations and boundaries imposed on the solution.

| ID    | Title             | Constraint                                                              | Category   | Source                 | Priority | Status |
|-------|-------------------|-------------------------------------------------------------------------|------------|------------------------|----------|--------|
| C-001 | Runtime Platform  | Backend must run on Java 21 LTS.                                        | Technical  |                        | High     | Open   |
| C-002 | Database Platform | System must use PostgreSQL 16.                                          | Technical  |                        | High     | Open   |
| C-003 | Browser Support   | UI must support Chrome, Firefox, and Safari (latest 2 versions).        | Technical  |                        | High     | Open   |
| C-004 | Budget Limit      | Total development cost must not exceed $50,000.                         | Business   |                        | High     | Open   |
| C-005 | Deadline          | System must be production-ready by Q2 2025.                             | Schedule   |                        | High     | Open   |
| C-006 | Right to Erasure  | Personal data of a customer must be erased within 30 days of a request. | Regulatory | GDPR Art. 17(1), 12(3) | High     | Open   |

The **Source** column is optional — omit it when no constraint comes from an outside document. It names where a
constraint comes from — a law, regulation, standard, or internal policy, down to the article or paragraph and, where it
matters, the version (`GDPR Art. 17(1)`, `ISO 27001:2022 A.8.24`, `Operating Policy OP-12 v3`) — so the origin of a
mandated rule stays traceable. When the column is present, fill it for every `Regulatory` constraint and leave it empty
for the others. Keep Status the last column.

## Glossary

The glossary fixes one name per domain concept, so requirements, use cases, test cases, and code all use the same
word. Use [references/glossary.md](references/glossary.md) as the structure (the path is relative to the folder
containing this SKILL.md): one table with the columns `Term | Definition | Avoid`.

- **Term** — the preferred name, in singular, as the business says it. One row per concept; never define a term twice.
- **Definition** — one or two sentences that tell this concept apart from its neighbors (a Guest is not necessarily
  the person who made the Reservation).
- **Avoid** — comma-separated synonyms that must not be used for this concept, or empty. Only list a word here when
  it would be ambiguous or misleading; a word listed here is flagged wherever it appears in the specifications.
  Never list a word the specifications need in another sense — an attribute or a column label (`Title` for Book
  when a book has a title), another term of the glossary, or a word of the screens and documents the project
  already has (`Login` for User Account when the application has a login view the use cases name);
  `/spec-review` cannot tell the senses apart. A Definition never uses a word of any Avoid cell either.

Take the terms from the vision and from the nouns of the user stories: roles, business objects, states, and business
events. Leave out generic words (system, data, user interface). When the glossary already exists, add new terms and
keep existing rows unless the user asks to change them.

## Reference

See [references/REFERENCE.md](references/REFERENCE.md) for ID prefixes, priority levels, status values, NFR categories, and constraint
categories. The path is relative to the folder containing this SKILL.md, not to the project root.

## Requirement Quality Checks

Every requirement must pass these checks before finalizing:

| Check       | Rule                                 | Bad Example                          | Good Example                  |
|-------------|--------------------------------------|--------------------------------------|-------------------------------|
| Measurable  | NFRs must have a number or threshold | "System should be fast"              | "Pages load within 2 seconds" |
| Singular    | One requirement per row              | "System must import and export data" | Split into FR-001 and FR-002  |
| Unambiguous | No subjective terms                  | "User-friendly interface"            | "WCAG 2.1 AA compliant"       |
| Testable    | Can write a pass/fail test           | "System is reliable"                 | "99.9% uptime over 30 days"   |
| Unique IDs  | No duplicate IDs across all tables   | Two FR-001 entries                   | Each ID used exactly once     |

## Error Recovery

- **Incomplete source document**: List what is missing (roles, NFR categories, constraints) and ask about it in the
  clarification step (workflow step 2) before proceeding
- **Ambiguous requirement from user**: Rewrite it as a measurable requirement and ask the user to confirm the threshold,
  proposing a number
- **Conflicting requirements**: Flag the conflict explicitly (e.g., "FR-003 requires real-time sync but C-002 limits to
  batch processing") and ask the user to resolve
- **Missing stakeholder roles**: Default to generic roles (User, Admin, System) and note them for user review

> **Format survives error recovery.** Ambiguity, conflict, and provisional
> status never justify abandoning the user-story form. Every FR row — even one
> you are flagging as conflicting or unconfirmed — must still read
> "As a [role], I want [goal] so that [benefit]." Record the issue in a note or
> in the Status column (e.g., `Conflict`, `Needs review`); never by dropping the
> requirement to a flat statement like "Support real-time sync."

## Workflow

1. Read the vision document or project brief
2. **Clarify before writing.** Scan the sources with [references/clarify-checklist.md](references/clarify-checklist.md)
   and ask the user the questions whose answer changes the catalog and has no reasonable default — at most five, the
   most important first (scope and roles before quality thresholds), each with a recommended option; for a quality
   threshold, propose a number. Write the answers into the rows and glossary terms they affect, never into a questions
   section. Decide everything else with the best default and report it as an assumption (step 12). When no one can
   answer — a pipeline run, a host without a way to ask, or the user said not to ask — take the recommended option for
   every question and report it as an assumption as well. For the questions of `docs/open_questions.md` on requirements
   and glossary terms (`FR-`, `NFR-`, `C-`, `Glossary:`), follow the section "In the Clarify Step of a Specification
   Skill" of `/open-questions` — locate it with a glob for `**/*open-questions/SKILL.md`; the folder may carry a host
   prefix such as `tessl__open-questions`.
3. Use TodoWrite to create tasks for each requirement type
4. Write the document header
5. For functional requirements:
    - Identify user roles
    - Define user stories with clear goals and benefits
    - Assign priorities based on business value
6. For non-functional requirements:
    - Define measurable quality attributes
    - Categorize by NFR type
    - Ensure requirements are testable
7. For constraints:
    - Document technical and business limitations
    - Categorize by constraint type
    - Name the source of each regulatory or externally imposed constraint in the Source column
8. Validate: run every requirement against the quality checks table above
    - No duplicate IDs across all tables
    - All Status columns filled
    - **Hard gate:** every FR User Story matches "As a [role], I want [goal] so
      that [benefit]" — scan each row; any row missing "As a", "I want", or "so
      that" is rejected and rewritten before finalizing, no exceptions
    - All NFRs contain a measurable threshold
9. When updating an existing catalog whose use cases exist, set the progress status of each requirement (Open,
   In Progress, Implemented, Verified) from the `**Status:**` of the use cases that link it, as defined under
   Status in the reference; never change a Deferred or Rejected status on your own
10. Create or update `docs/glossary.md` with the domain terms used in the catalog, and use exactly those terms (never
   an Avoid synonym) in every requirement
11. Mark todos complete
12. Report the **Clarified**, **Assumed**, and **Open** items as described in the clarification checklist. When
    the project has architecture decision records (glob `docs/**/decisions/*.md`, `docs/**/adr/*.md`, or `docs/**/adrs/*.md`) and this run changed, rejected, or
    deferred an NFR or constraint, or removed one, name the ADRs whose `**Requirements:**` line links it and hand off
    to `/architecture-decision ADR-XXX` to revisit each; never edit an ADR. When the user states an architecture
    decision while you gather requirements, write the NFR or constraint behind it here and hand the decision itself
    to `/architecture-decision`
