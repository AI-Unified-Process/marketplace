---
name: use-case-spec
description: >
  Creates and updates detailed use case specification documents (docs/use_cases/UC-XXX-*.md)
  with actors, trigger, preconditions, main success scenarios, alternative flows,
  postconditions, and business rules, clarifies open questions first, links the
  requirements each use case realizes, and validates every file with a bundled
  script. Use when the user asks to "write a use case", "specify a use case", "document
  system behavior", "define scenarios", "write a functional spec", or mentions
  use case specification, acceptance criteria, or user scenarios. Also trigger
  whenever the task is to write use case specification documents for the use
  cases in a use case diagram (e.g. docs/use_cases.puml) — including phrasings
  like "detailed use case specifications before writing any code", "one file
  per use case", or a request to cover the happy path, alternative flows,
  postconditions, and business rules for each use case.
---

<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# Use Case Specification

## Instructions

Create or update use case specification documents for $ARGUMENTS in `docs/use_cases/`. Each use case describes a complete interaction between an actor and the system to achieve a goal.

## File naming (do this exactly)

One file per use case, written to `docs/use_cases/UC-XXX-<kebab-case-name>.md` where:

- `UC-XXX` is the use case's three-digit ID (e.g. `UC-001`).
- `<kebab-case-name>` is the use case **name taken verbatim from the use case
  diagram** (`docs/use_cases.puml`), lowercased with spaces replaced by hyphens.
  Do not paraphrase, expand, or reorder the words.
- In a project split by module (`docs/use_cases.puml` is a `@startuml Modules` overview), the file goes into the
  folder of the module whose diagram holds the use case: a use case of `docs/use_cases/billing/use_cases.puml` is
  written to `docs/use_cases/billing/UC-XXX-<kebab-case-name>.md`.

| Use case name in diagram | Correct filename                     |
|--------------------------|--------------------------------------|
| `Register Account`       | `docs/use_cases/UC-001-register-account.md` |
| `Check In Guest`         | `docs/use_cases/UC-002-check-in-guest.md` (never `checkin-guest`) |
| `Place Order`            | `docs/use_cases/UC-001-place-order.md` |

## Scope: one or many use cases

- If the task names a single use case (e.g. "write UC-001 Place Order"), produce
  **only** that one file. Do not create specs for other use cases in the diagram.
- If the task asks for "all use cases" or names several, produce **one file per
  use case**:
  - `UC-XXX` IDs come from the diagram and never repeat.
  - `BR-XXX` business-rule IDs are **unique within their own file only** and
    **restart at `BR-001` in every file** — the use case is the namespace. When
    referring to a rule of another use case, qualify it with the use case id
    (e.g. "UC-005 BR-002"), never by the bare rule id.

## DO NOT

- Mix multiple use cases in one document, or skip numbering the steps of the Main Success Scenario
- Use technical implementation details in the flow steps (see "Step writing guidelines")
- Invent an alternative flow, a precondition, or a postcondition only to fill a section

The rules for each section are in the workflow step that writes it.

## Template

Use [references/use-case.md](references/use-case.md) as the document structure, and
see [references/example.md](references/example.md) for a complete worked example —
actor-focused steps, alternative flows that reference specific step numbers, and
success postconditions paired with failure postconditions written as minimum guarantees. These paths are relative to the folder
containing this SKILL.md, not to the project root.

The normative definition of the format — including the German variant and the
tolerances of the AI Unified Process Studio structured editor — is
[references/format-spec.md](references/format-spec.md); what goes into the Overview lines and the failure
postconditions is in [references/overview-and-postconditions.md](references/overview-and-postconditions.md). A machine check of both
the structure and the rules of this skill is bundled as
[scripts/validate_use_case.py](scripts/validate_use_case.py).

## Step writing guidelines

| Do                                  | Don't                                         |
|-------------------------------------|-----------------------------------------------|
| "User saves the reservation"        | "User clicks the blue Save button"            |
| "System displays error message"     | "System throws ValidationException"           |
| "System stores the reservation"     | "System executes INSERT INTO reservations..." |
| "System sends a confirmation email" | "System opens an SMTP connection to sendmail" |
| "System securely stores the password" | "System hashes the password with bcrypt/SHA + salt" |
| "System signs the user in"          | "System issues a JWT / signs a token with expiry" |

Steps describe **what** the actor and system achieve, never **how** it is
implemented. Keep out protocol and infrastructure terms (SMTP, JWT, bcrypt,
hashing, SQL/INSERT/SELECT, HTTP verbs, class and exception names) — those belong
in the implementation, not the specification.

## Workflow

1. Read the `docs/requirements.md` and `docs/use_cases.puml` — with modules, also the module diagrams
   `docs/use_cases/*/use_cases.puml` — and `docs/glossary.md` when it exists. Use the
   glossary's terms for actors, business objects, and states, and never a synonym listed in its Avoid column; a new
   domain term the use case needs goes into the glossary (see `/requirements`).
2. Determine the set of use cases to document (one, several, or all in the
   diagram — see "Scope" above). Take each `UC-XXX` ID and name from the diagram.
   Before writing, ask of each one: *is this use case a complete goal that the primary
   actor would recognize as valuable?* A subfunction ("Validate METAR", "Load NOTAM",
   "Persist Result") is a step of a larger user goal ("Determine Airport Suitability"),
   and a summary ("Manage Flight Operations") spans several; one actor adding, changing,
   and removing one business object ("Manage Catalog") is a user goal, not a summary. A scenario that hands the
   work over to another role, waits for an outside event or a deadline, or runs branches
   in parallel for different actors is a summary, too: its parts are separate user goals,
   and the flow between them is a business process in BPMN (`docs/processes/`, written by
   `/business-process`), not a
   section of the use case. Do not rename, merge, or
   split use cases yourself — the ids belong to the diagram. Write the specification,
   then tell the user which use case looks like a subfunction or a summary, name the
   user goal it belongs to, and hand off to `/use-case-diagram`. A subfunction that the
   diagram draws as an `<<include>>` shared by several use cases is intended; leave it.
3. **Clarify before writing.** Scan the sources for each use case with
   [references/clarify-checklist.md](references/clarify-checklist.md) and ask the user the questions whose answer
   changes the specification and has no reasonable default — at most five per use case, the most important first,
   each with a recommended option. Write the answers into the steps, flows, and rules they affect, never into a
   questions section. Decide everything else with the best default and report it as an assumption (step 16). When
   no one can answer — a pipeline run, a host without a way to ask, or the user said not to ask — take the
   recommended option for every question and report it as an assumption as well. Never ask about implementation
   choices; they do not belong in a use case.
4. Use TodoWrite to track progress — one item per use case file.
5. For each use case, derive the filename with the rule in "File naming" above.
6. Write the Overview section — `Use Case ID`, primary actors, secondary actors, goal, trigger, and a `Status` from
   the status values of [references/format-spec.md](references/format-spec.md), then the Requirements line and,
   when the use case is not offered through every entry point, the Layers line. Read
   [references/overview-and-postconditions.md](references/overview-and-postconditions.md) first: it defines who
   is a primary or secondary actor, what makes a trigger an event rather than a precondition, how the
   Requirements line links the catalog, and which values the Layers line takes.
7. Define preconditions — verifiable facts that must be true before the use case starts. They are
   states the system has already established (often by another use case), never events or actor
   actions, and the use case does not check them again. **A precondition must not describe a
   condition that is established or evaluated during the use case**: when the fact depends on input
   the actor gives in a step ("a room is available *for the requested dates*"), when a step checks
   it, or when an alternative flow handles its violation, it is not a precondition but a condition
   to handle in the Main Success Scenario and its alternative flow. Keep the stable state it rests
   on instead (`Room inventory is configured`).
8. Write the Main Success Scenario as numbered steps (start at 1, no gaps),
   alternating actor action and system response, ending with the goal achieved.
9. Analyze **every** Main Success Scenario step for meaningful alternative or exception
   conditions — can the actor decide differently, can the input be invalid, can a check fail,
   can an external system refuse or not answer? Document every extension you identify (error
   conditions, optional paths, exceptional situations); most real use cases have two or more.
   Each one must:
   - name a **Trigger** that references a specific main-scenario step number,
     written as `(step N)` (e.g. `Payment is declined (step 7)`); and
   - end with either `Use case continues at step N.` or `Use case ends.`

   Do **not** invent an alternative flow solely to satisfy the template. When the analysis finds
   no meaningful alternative, replace the template flow with an italic placeholder that states the
   result, e.g. `_None — no step of the main success scenario can fail or branch._` The validator
   accepts the placeholder as a deliberate statement and warns only when the section is left empty.
10. Define postconditions for both success and failure (both subsections non-empty). **Success Postconditions**
   state what is true when the goal is achieved. **Failure Postconditions** are the minimum guarantees for every
   unsuccessful end — what the system protects, not how it reacts; a use case that changes no data gets the
   placeholder `_None — the use case changes no data._`. The rules are in
   [references/overview-and-postconditions.md](references/overview-and-postconditions.md).
11. Document applicable business rules with `BR-XXX` IDs, numbered as "Scope" says.
12. Write each use case to its **own** file completely before moving to the next —
    never merge two use cases into one file, and never leave a planned file unwritten.
13. Check each file against steps 6–11 and "Step writing guidelines" — the definition of done; the validator in
    step 14 checks most of it mechanically. Fix anything that fails.
14. **Final verification (do this before declaring done):** list the contents of
    `docs/use_cases/` (with modules, the module folders) and confirm every `UC-XXX` from your scope has exactly one
    file present, named as "File naming" says. Rename any mismatch. Then run the bundled validator over every file you wrote (the script
    path is relative to this skill's directory):

    ```bash
    python3 scripts/validate_use_case.py --strict <the files you wrote>
    ```

    Fix every reported problem and re-run until it exits cleanly. Errors mean the
    Studio structured editor cannot read the file; warnings mean a rule of this
    skill is violated — e.g. an implementation term in a step, which "Step writing guidelines" shows how to rewrite.
15. Mark todo complete.
16. **Quality gate — hand off, do not self-review.** The validator checks structure; it cannot judge
    whether a use case is a user goal, whether its actors are right, whether the scenario reaches the
    goal, whether every failing step has a flow, or whether rules and postconditions are testable.
    That semantic review is `/spec-review`. Tell the user which files you wrote, list what step 3
    clarified, assumed, and left open (the report format is in the clarification checklist), and offer
    `/spec-review UC-XXX` for each of them (or `/spec-review` for the whole project after writing all
    use cases) before a use case moves to `Reviewed`. Do not run it yourself and do not restate its
    checklist here — one review, in one place.
