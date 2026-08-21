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
| `Log In`                 | `docs/use_cases/UC-002-log-in.md`    |
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
- Leave postconditions undefined
- Mix multiple use cases in one document
- Use technical implementation details in the flow steps

## Template

Use [references/use-case.md](references/use-case.md) as the document structure, and
see [references/example.md](references/example.md) for a complete worked example —
actor-focused steps, alternative flows that reference specific step numbers, and
paired success/failure postconditions.

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
| "User clicks Save button"           | "User triggers onClick handler"               |
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

1. Read the `docs/requirements.md` and `docs/use_cases.puml`.
2. Determine the set of use cases to document (one, several, or all in the
   diagram — see "Scope" above). Take each `UC-XXX` ID and name from the diagram.
3. Use TodoWrite to track progress — one item per use case file.
4. For each use case, derive the filename with the rule in "File naming" above.
5. Write the Overview section: `Use Case ID`, primary actor, goal, and a `Status`
   from the "Status values" list above.
6. Define preconditions — verifiable facts that must be true before the use case starts.
7. Write the Main Success Scenario as numbered steps (start at 1, no gaps),
   alternating actor action and system response, ending with the goal achieved.
8. Identify **all** meaningful alternative flows (error conditions, optional paths,
   exceptional situations) — most real use cases have two or more. Each one must:
   - name a **Trigger** that references a specific main-scenario step number,
     written as `(step N)` (e.g. `Payment is declined (step 7)`); and
   - end with either `Use case continues at step N.` or `Use case ends.`
9. Define postconditions for both success and failure (both subsections non-empty).
10. Document applicable business rules with `BR-XXX` IDs, numbered `BR-001`,
    `BR-002`, … within the file. Every file starts again at `BR-001`; rule ids are
    scoped to their use case (see "Scope").
11. Write each use case to its **own** file completely before moving to the next —
    never merge two use cases into one file, and never leave a planned file unwritten.
12. Run the Completeness Checklist below; fix anything that fails.
13. **Final verification (do this before declaring done):** list the contents of
    `docs/use_cases/` and confirm every `UC-XXX` from your scope has exactly one
    file present, named `UC-XXX-<kebab-case-name>.md` (kebab-case of the diagram
    name — e.g. `Log In` → `UC-002-log-in.md`, never `UC-002-login.md`). Rename any
    mismatch. Then run the bundled validator over every file you wrote (the script
    path is relative to this skill's directory):

    ```bash
    python3 scripts/validate_use_case.py --strict docs/use_cases/UC-*.md
    ```

    Fix every reported problem and re-run until it exits cleanly. Errors mean the
    Studio structured editor cannot read the file; warnings mean a rule of this
    skill is violated — e.g. an implementation-level term (`SMTP`, `JWT`, `token`,
    `bcrypt`, `hash`, `SQL`, …) in a step, which must be rewritten at the business
    level: a registration or login use case says "System verifies the credentials"
    / "System confirms the account" — never how the password or session is handled.
14. Mark todo complete.

## Completeness Checklist

The validator in step 13 checks all of these mechanically — run it rather than
verifying by eye. The list remains the definition of done:

- [ ] Each file is named `UC-XXX-<kebab-case-name>.md` using the name from the diagram, and documents exactly one use case.
- [ ] Overview has a `Use Case ID` (`UC-XXX`), primary actor, goal, and a valid `Status` value.
- [ ] The Main Success Scenario starts at step 1, has no gaps, and its final step states the goal being achieved.
- [ ] At least one alternative flow exists (two or more when the use case has several failure paths); each has a **Trigger** that references a specific main-scenario step number as `(step N)`.
- [ ] Every alternative flow ends with `Use case continues at step N.` or `Use case ends.` — never open-ended.
- [ ] Both Success and Failure postconditions are defined and non-empty.
- [ ] Each business rule has a `BR-XXX` ID, numbered `BR-001`, `BR-002`, … without gaps within its file; every file starts at `BR-001` (rule ids are scoped to their use case).
- [ ] No step contains technical implementation detail — no HTTP verbs (POST/GET), SQL, class names, regex, exception names, or protocol terms (SMTP, JWT, bcrypt). See "Step writing guidelines" above.
