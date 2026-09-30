---
name: use-case-spec
description: >
  Creates detailed use case specification documents with actors, preconditions,
  main success scenarios, alternative flows, postconditions, and business rules.
  Use when the user asks to "write a use case", "specify a use case", "document
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

| Use case name in diagram | Correct filename                     |
|--------------------------|--------------------------------------|
| `Register Account`       | `docs/use_cases/UC-001-register-account.md` |
| `Check In Guest`         | `docs/use_cases/UC-002-check-in-guest.md` |
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

- Write vague or incomplete scenarios
- Skip numbering steps in the Main Success Scenario
- Omit alternative flows for error conditions
- Invent an alternative flow only to fill the section — when no step has a meaningful alternative or exception
  condition, say so with a placeholder (see workflow step 8)
- Leave postconditions undefined
- Describe the reaction to a failure ("System displays an error message") as a failure postcondition — that
  is a step of the alternative flow; failure postconditions are guarantees that hold on every unsuccessful end
- Write a technical step (validate, load, persist) as if it were a user goal — see workflow step 2
- Write an event or an actor action as a precondition ("User clicks New Order") — that is the trigger
- Write a precondition that the use case establishes or evaluates itself ("A room is available for the requested
  dates" when the dates are entered in step 4 and availability is checked in step 5) — that is a step and an
  alternative flow
- Mix multiple use cases in one document
- Use technical implementation details in the flow steps

## Template

Use [references/use-case.md](references/use-case.md) as the document structure, and
see [references/example.md](references/example.md) for a complete worked example —
actor-focused steps, alternative flows that reference specific step numbers, and
success postconditions paired with failure postconditions written as minimum guarantees. These paths are relative to the folder
containing this SKILL.md, not to the project root.

The normative definition of the format — including the German variant and the
tolerances of the AI Unified Process Studio structured editor — is
[references/format-spec.md](references/format-spec.md). A machine check of both
the structure and the rules of this skill is bundled as
[scripts/validate_use_case.py](scripts/validate_use_case.py).

## Status values

| Status      | Description                                      |
|-------------|--------------------------------------------------|
| Draft       | Initial version, still being written.            |
| Reviewed    | Complete, awaiting stakeholder review.           |
| Approved    | Reviewed and approved for implementation.        |
| Implemented | Implementation complete, pending testing.        |
| Tested      | All tests pass, pending final acceptance.        |
| Done        | Fully implemented, tested, and accepted.         |
| Obsolete    | No longer valid, superseded by another use case. |

## Step writing guidelines

| Do                                  | Don't                                         |
|-------------------------------------|-----------------------------------------------|
| "User saves the reservation"        | "User clicks the blue Save button"            |
| "User confirms the order"           | "User triggers onClick handler"               |
| "System validates the email format" | "System runs regex /^[\w]+@[\w]+$/"           |
| "System displays error message"     | "System throws ValidationException"           |
| "User enters check-in date"         | "User populates dateField component"          |
| "System stores the reservation"     | "System executes INSERT INTO reservations..." |
| "System records the new account"    | "System runs INSERT INTO users / SELECT ..."  |
| "System sends a confirmation email" | "System opens an SMTP connection to sendmail" |
| "System securely stores the password" | "System hashes the password with bcrypt/SHA + salt" |
| "System signs the user in"          | "System issues a JWT / signs a token with expiry" |

Steps describe **what** the actor and system achieve, never **how** it is
implemented. Keep out protocol and infrastructure terms (SMTP, JWT, bcrypt,
hashing, SQL/INSERT/SELECT, HTTP verbs, class and exception names) — those belong
in the implementation, not the specification.

## Workflow

1. Read the `docs/requirements.md` and `docs/use_cases.puml`, and `docs/glossary.md` when it exists. Use the
   glossary's terms for actors, business objects, and states, and never a synonym listed in its Avoid column; a new
   domain term the use case needs goes into the glossary (see `/requirements`).
2. Determine the set of use cases to document (one, several, or all in the
   diagram — see "Scope" above). Take each `UC-XXX` ID and name from the diagram.
   Before writing, ask of each one: *is this use case a complete goal that the primary
   actor would recognize as valuable?* A subfunction ("Validate METAR", "Load NOTAM",
   "Persist Result") is a step of a larger user goal ("Determine Airport Suitability"),
   and a summary ("Manage Flight Operations") spans several. A scenario that hands the
   work over to another role, waits for an outside event or a deadline, or runs branches
   in parallel for different actors is a summary, too: its parts are separate user goals,
   and the flow between them is a business process in BPMN (`docs/processes/`), not a
   section of the use case. Do not rename, merge, or
   split use cases yourself — the ids belong to the diagram. Write the specification,
   then tell the user which use case looks like a subfunction or a summary, name the
   user goal it belongs to, and hand off to `/use-case-diagram`. A subfunction that the
   diagram draws as an `<<include>>` shared by several use cases is intended; leave it.
3. Use TodoWrite to track progress — one item per use case file.
4. For each use case, derive the filename with the rule in "File naming" above.
5. Write the Overview section: `Use Case ID`, primary actor, secondary actors, goal, trigger, and a
   `Status` from the "Status values" list above. The primary actors are the roles that pursue the
   goal. A use case often has one, but it may have several: list them comma-separated
   (`**Primary Actor:** Front Desk Clerk, Guest`) when each of them can start the use case on its
   own and pursues the same goal through the same main success scenario — never joined with "or"
   or "and", and never "System". When two roles pursue different goals or need different
   scenarios, they are two use cases. Name concrete roles from the requirements and the glossary
   rather than a generic "User" when the requirements distinguish roles. Secondary actors are the
   roles and external systems that support the use case or provide information or services to it
   (e.g. `**Secondary Actors:** Weather Service, Flight Planning System`). Name them so an
   implementation treats them as outside the system's responsibility, not as something to build. Omit the `**Secondary Actors:**` line when the use
   case has none. The `**Trigger:**` line (German documents: `**Auslösendes Ereignis:**`, never
   `**Auslöser:**`, which labels alternative flows) names the **event** that starts the use case: an
   actor's request (`Dispatcher requests an airport suitability assessment`), a point in time
   (`End of each business day`), or a message from an external system (`Payment Service reports a
   chargeback`). It happens at a moment; a precondition is a state that is already true. Test it by
   asking "when does this happen?" — `User is logged in` has no moment and is a precondition. The
   trigger may coincide with step 1, but step 1 does not repeat it word for word. When `docs/requirements.md` exists, add a
   `**Requirements:**` line after the `Status` line: one Markdown link to the catalog
   whose link text lists the requirement ids — at least the functional requirements
   (`FR-*`) this use case realizes, plus the non-functional requirements (`NFR-*`) and
   constraints (`C-*`) it must respect, e.g.
   `**Requirements:** [FR-001, NFR-004, C-003](../requirements.md)`. List ids only,
   never copy requirement text — `requirements.md` stays the source of truth.
   `/spec-review` uses the line to find requirements no use case covers and ids that
   do not exist. Omit the line only when there is no `docs/requirements.md`.
6. Define preconditions — verifiable facts that must be true before the use case starts. They are
   states the system has already established (often by another use case), never events or actor
   actions, and the use case does not check them again. **A precondition must not describe a
   condition that is established or evaluated during the use case**: when the fact depends on input
   the actor gives in a step ("a room is available *for the requested dates*"), when a step checks
   it, or when an alternative flow handles its violation, it is not a precondition but a condition
   to handle in the Main Success Scenario and its alternative flow. Keep the stable state it rests
   on instead (`Room inventory is configured`).
7. Write the Main Success Scenario as numbered steps (start at 1, no gaps),
   alternating actor action and system response, ending with the goal achieved.
8. Analyze **every** Main Success Scenario step for meaningful alternative or exception
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
9. Define postconditions for both success and failure (both subsections non-empty).
   - **Success Postconditions** state what is true when the primary actor's goal is achieved.
   - **Failure Postconditions** describe the minimum guarantees that must hold for every unsuccessful
     termination of the use case — every alternative flow that ends with `Use case ends.`, a cancellation,
     or a failure of a secondary actor. They state what the system protects when the goal is not reached
     (Cockburn's *Minimal Guarantees*), not what it does in reaction to the failure: "No reservation is
     created", "Existing valid data is not overwritten", "An incomplete result is never presented as
     valid", "No partial payment remains booked". A message, a notification, or a return to a screen is
     not a guarantee — it belongs in the alternative flow that handles the failure. A statement that
     holds for only one failure path belongs in that flow, not here.
10. Document applicable business rules with `BR-XXX` IDs, numbered `BR-001`,
    `BR-002`, … within the file. Every file starts again at `BR-001`; rule ids are
    scoped to their use case (see "Scope").
11. Write each use case to its **own** file completely before moving to the next —
    never merge two use cases into one file, and never leave a planned file unwritten.
12. Run the Completeness Checklist below; fix anything that fails.
13. **Final verification (do this before declaring done):** list the contents of
    `docs/use_cases/` and confirm every `UC-XXX` from your scope has exactly one
    file present, named `UC-XXX-<kebab-case-name>.md` (kebab-case of the diagram
    name — e.g. `Check In Guest` → `UC-002-check-in-guest.md`, never `UC-002-checkin-guest.md`). Rename any
    mismatch. Then run the bundled validator over every file you wrote (the script
    path is relative to this skill's directory):

    ```bash
    python3 scripts/validate_use_case.py --strict docs/use_cases/UC-*.md
    ```

    Fix every reported problem and re-run until it exits cleanly. Errors mean the
    Studio structured editor cannot read the file; warnings mean a rule of this
    skill is violated — e.g. an implementation-level term (`SMTP`, `JWT`, `token`,
    `bcrypt`, `hash`, `SQL`, …) in a step, which must be rewritten at the business
    level: a registration use case says "System records the new account" / "System
    confirms the account" — never how the password is stored or the session is created.
14. Mark todo complete.
15. **Quality gate — hand off, do not self-review.** The validator checks structure; it cannot judge
    whether a use case is a user goal, whether its actors are right, whether the scenario reaches the
    goal, whether every failing step has a flow, or whether rules and postconditions are testable.
    That semantic review is `/spec-review`. Tell the user which files you wrote and offer
    `/spec-review UC-XXX` for each of them (or `/spec-review` for the whole project after writing all
    use cases) before a use case moves to `Reviewed`. Do not run it yourself and do not restate its
    checklist here — one review, in one place.

## Completeness Checklist

The validator in step 13 checks all of these mechanically — run it rather than
verifying by eye. The list remains the definition of done:

- [ ] Each file is named `UC-XXX-<kebab-case-name>.md` using the name from the diagram, and documents exactly one use case.
- [ ] Overview has a `Use Case ID` (`UC-XXX`), one or more primary actors (comma-separated), goal, and a valid `Status` value, plus a `**Secondary Actors:**` line when supporting roles or external systems take part.
- [ ] Overview has a `**Trigger:**` line naming the event that starts the use case (an actor's request, a point in time, or an external system's message) — not a state, and not a copy of a precondition.
- [ ] Preconditions are states that are already true, not events or actor actions, and none is established or evaluated during the use case (no step checks it, no alternative flow handles it).
- [ ] When `docs/requirements.md` exists, Overview has a `**Requirements:**` line linking to it with at least one `FR-*` id, and every listed `FR-*`, `NFR-*`, `C-*` id exists in the catalog (`/spec-review` checks this one, not the validator).
- [ ] The Main Success Scenario starts at step 1, has no gaps, and its final step states the goal being achieved.
- [ ] Every Main Success Scenario step was analyzed for alternative and exception conditions, and every meaningful one is an alternative flow (usually two or more); when there is none, the section holds an italic `_None — …_` placeholder instead of an invented flow.
- [ ] Each alternative flow has a **Trigger** that references a specific main-scenario step number as `(step N)`.
- [ ] Every alternative flow ends with `Use case continues at step N.` or `Use case ends.` — never open-ended.
- [ ] Both Success and Failure postconditions are defined and non-empty.
- [ ] Every failure postcondition is a minimum guarantee that holds for every unsuccessful end of the use case — not a system reaction such as an error message, and not an outcome of a single failure path (`/spec-review` judges this one, not the validator).
- [ ] Each business rule has a `BR-XXX` ID, numbered `BR-001`, `BR-002`, … without gaps within its file; every file starts at `BR-001` (rule ids are scoped to their use case).
- [ ] No step contains technical implementation detail — no HTTP verbs (POST/GET), SQL, class names, regex, exception names, or protocol terms (SMTP, JWT, bcrypt). See "Step writing guidelines" above.
