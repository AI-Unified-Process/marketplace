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

## DO NOT

- Write vague or incomplete scenarios
- Skip numbering steps in the Main Success Scenario
- Omit alternative flows for error conditions
- Leave postconditions undefined
- Mix multiple use cases in one document
- Use technical implementation details in the flow steps

## Template

Use [templates/use-case.md](templates/use-case.md) as the document structure, and
see [references/example.md](references/example.md) for a complete worked example.

## Workflow

1. Read the `docs/requirements.md` and `docs/use_case_diagram.puml`
2. Identify the single use case to document, and assign its `UC-XXX` ID.
3. Use TodoWrite to track progress.
4. Write the Overview section: actor, goal, and a `Status` from the template's list.
5. Define preconditions — verifiable facts that must be true before the use case starts.
6. Write the Main Success Scenario as numbered steps, alternating actor action and
   system response, ending with the goal achieved.
7. Identify alternative flows (error conditions, optional paths, exceptional
   situations). Each must name a **Trigger** tied to a specific main-scenario step
   number, and end by either returning to a numbered step or ending the use case.
8. Define postconditions for both success and failure.
9. Document applicable business rules with `BR-XXX` IDs.
10. Run the Completeness Checklist below; fix anything that fails.
11. Mark todo complete.

## Completeness Checklist

Before considering the document done, verify every item:

- [ ] Exactly one use case is documented in the file.
- [ ] Overview has a `UC-XXX` ID, primary actor, goal, and a valid `Status` value.
- [ ] The Main Success Scenario has numbered steps (no gaps) and ends with the goal achieved.
- [ ] At least one alternative flow exists; each has a **Trigger** that references a
      specific main-scenario step number.
- [ ] Every alternative flow ends by returning to a numbered step or ending the use case.
- [ ] Both Success and Failure postconditions are defined.
- [ ] Each business rule has a `BR-XXX` ID and is referenced by, or relevant to, a step.
- [ ] No step contains technical implementation detail (see the template's step-writing guidelines).
