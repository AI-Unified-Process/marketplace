---
name: use-case-spec
description: >
  Creates detailed use case specification documents with actors, preconditions,
  main success scenarios, alternative flows, postconditions, and business rules.
  Use when the user asks to "write a use case", "specify a use case", "document
  system behavior", "define scenarios", "write a functional spec", or mentions
  use case specification, acceptance criteria, or user scenarios.
---

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
  use case**, and number IDs **globally across all files in this task**:
  - `UC-XXX` IDs come from the diagram and never repeat.
  - `BR-XXX` business-rule IDs are unique across **every** file — they do **not**
    restart at `BR-001` in the second file. If UC-001 ends at `BR-003`, UC-002
    starts at `BR-004`.

## DO NOT

- Write vague or incomplete scenarios
- Skip numbering steps in the Main Success Scenario
- Omit alternative flows for error conditions
- Leave postconditions undefined
- Mix multiple use cases in one document
- Use technical implementation details in the flow steps

## Template

Use [references/use-case.md](references/use-case.md) as the document structure, and
see [references/example.md](references/example.md) for a complete worked example.

## Workflow

1. Read the `docs/requirements.md` and `docs/use_cases.puml`.
2. Determine the set of use cases to document (one, several, or all in the
   diagram — see "Scope" above). Take each `UC-XXX` ID and name from the diagram.
3. Use TodoWrite to track progress — one item per use case file.
4. For each use case, derive the filename with the rule in "File naming" above.
5. Write the Overview section: `Use Case ID`, primary actor, goal, and a `Status`
   from the template's list.
6. Define preconditions — verifiable facts that must be true before the use case starts.
7. Write the Main Success Scenario as numbered steps (start at 1, no gaps),
   alternating actor action and system response, ending with the goal achieved.
8. Identify **all** meaningful alternative flows (error conditions, optional paths,
   exceptional situations) — most real use cases have two or more. Each one must:
   - name a **Trigger** that references a specific main-scenario step number,
     written as `(step N)` (e.g. `Payment is declined (step 7)`); and
   - end with either `Use case continues at step N.` or `Use case ends.`
9. Define postconditions for both success and failure (both subsections non-empty).
10. Document applicable business rules with `BR-XXX` IDs. When writing more than one
    use case in this task, keep `BR-XXX` IDs unique across all files (never restart
    at `BR-001` — see "Scope").
11. Write each use case to its **own** file completely before moving to the next —
    never merge two use cases into one file, and never leave a planned file unwritten.
12. Run the Completeness Checklist below; fix anything that fails.
13. **Final verification (do this before declaring done):** list the contents of
    `docs/use_cases/` and confirm every `UC-XXX` from your scope has exactly one
    file present, named `UC-XXX-<kebab-case-name>.md` (kebab-case of the diagram
    name — e.g. `Log In` → `UC-002-log-in.md`, never `UC-002-login.md`). Rename any
    mismatch. Then search every file you wrote for these forbidden words and rewrite
    the step at the business level if any appears: `SMTP`, `email server`, `JWT`,
    `token`, `bcrypt`, `hash`, `salt`, `SHA`, `SELECT`, `INSERT`, `SQL`. A
    registration or login use case must say "System verifies the credentials" /
    "System confirms the account" — never how the password or session is handled.
14. Mark todo complete.

## Completeness Checklist

Before considering the document done, verify every item:

- [ ] Each file is named `UC-XXX-<kebab-case-name>.md` using the name from the diagram, and documents exactly one use case.
- [ ] Overview has a `Use Case ID` (`UC-XXX`), primary actor, goal, and a valid `Status` value.
- [ ] The Main Success Scenario starts at step 1, has no gaps, and its final step states the goal being achieved.
- [ ] At least one alternative flow exists (two or more when the use case has several failure paths); each has a **Trigger** that references a specific main-scenario step number as `(step N)`.
- [ ] Every alternative flow ends with `Use case continues at step N.` or `Use case ends.` — never open-ended.
- [ ] Both Success and Failure postconditions are defined and non-empty.
- [ ] Each business rule has a `BR-XXX` ID; across multiple files in one task, the IDs are unique and do not restart at `BR-001`.
- [ ] No step contains technical implementation detail — no HTTP verbs (POST/GET), SQL, class names, regex, exception names, or protocol terms (SMTP, JWT, bcrypt). See the template's step-writing guidelines.
