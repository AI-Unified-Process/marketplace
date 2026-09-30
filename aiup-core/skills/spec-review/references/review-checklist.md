<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# Semantic Review Checklist

The checks below need understanding, so `spec_lint.py` cannot make them. Each one says what to look for, where, and
how to tell a finding from a false alarm. Severity is `warning` when the defect will make the implementation or the
tests wrong, and `info` when it only makes the specification harder to read or maintain. Never `error`.

## 1. Contradictions

**Where:** business rules across all use cases; rules against the Main Success Scenario and alternative flows of
their own use case; rules against NFRs and constraints in `requirements.md`.

Two statements contradict when no system can satisfy both for the same input: different limits for the same
quantity (6 vs 12 months, 18 vs 21 years), a state one use case allows and another forbids, an alternative flow that
ends where a rule says the use case must continue. Different rules for different actors or states are not a
contradiction — check the conditions before reporting.

Report the finding on the later of the two rules and name the other one (`UC-009 BR-001`). Severity: `warning`.

## 2. Duplication in other words

**Where:** business rules across use cases.

The same rule written differently in two places drifts apart with the next change. The lint catches identical text
(`BR_DUPLICATE`); you catch the paraphrase — same condition, same consequence, different wording. The fix is to keep
the rule in the use case that owns the data and cite it elsewhere as `UC-xxx BR-yyy`. Severity: `warning` when the
two wordings could be read differently, `info` when they are equivalent.

## 3. Wrong level

**Where:** steps, alternative flows, and business rules of a use case.

A use case states what the actor and the system achieve, not how the screen looks or how the data is stored:

- UI detail: colors, positions, widget types, pixel sizes, "clicks the blue button", "selects from the dropdown in
  the top right"
- Technical detail: table and column names, "stores in table X", REST calls, queues, caches, framework or class names

Naming the business action ("Clerk confirms the booking") is fine; naming a button label the business insists on is
fine when the specification says so. `validate_use_case.py` already flags a fixed list of protocol terms
(`TECHNICAL_TERM`); report what that list misses. Severity: `info`, `warning` when the detail constrains the
implementation in a way nobody decided.

**Where, too:** the use case as a whole — its name in `docs/use_cases.puml`, its goal, and its Main Success
Scenario.

Every use case should be a user goal: ask *is this use case a complete goal that the primary actor would recognize as
valuable?* Report a use case that fails the question:

- Subfunction: a step of a larger goal, usually technical — "Validate METAR", "Load NOTAM", "Persist Result". Its
  scenario is two or three system steps with no result the actor would ask for. Name the user goal it belongs to
  ("Determine Airport Suitability"), which may already exist in the diagram.
- Summary: an area of work spanning several sittings — "Manage Flight Operations". Name the user goals it splits
  into.

A subfunction the diagram draws as an `<<include>>` from several use cases is intended; do not report it. Severity:
`warning` for a technical step modeled as a use case of its own, `info` otherwise. The fix belongs to
`/use-case-diagram`.

## 4. Completeness

**Where:** the Main Success Scenario, alternative flows, and postconditions.

- A step that can fail — a validation, a lookup, a payment, a call to another system, a concurrent change — without
  an alternative flow whose trigger references that step (`(step N)`)
- A failure path without a matching failure postcondition, or a failure postcondition no flow leads to
- A precondition that nothing establishes: no other use case produces the state it requires
- A business rule that no step or flow applies

Severity: `warning`.

## 5. Testability

**Where:** business rules, postconditions, and requirement rows the use case references.

A rule is testable when a test can set up the input and decide pass or fail from what the system shows or stores.
Untestable: "the system handles large volumes", "data is kept secure", "the user is informed in time". Suggest the
measurable version (a number, a limit, an observable message). Severity: `warning`.

## 6. Ambiguity

**Where:** everywhere.

- A missing actor: passive voice that hides who acts ("the data is checked" — by the system or by the clerk?)
- Unclear quantities and ranges: "some", "several", "large", "recent", "up to date"; boundaries without
  inclusive/exclusive ("between 1 and 10")
- Pronouns with two possible referents ("it", "they" after two nouns)
- Undefined domain terms: a term that carries business meaning but is neither in `glossary.md` nor explained where it
  is used; the same thing called by two names across documents

Weak words from the fixed list are the lint's job (`WEAK_WORD`); report what the list cannot catch. Severity:
`info`, `warning` when the two readings lead to different behavior.

## 7. Entity model consistency

**Where:** steps, rules, and postconditions against `docs/entity_model.md`.

Specifications name data in business words, so judge from context, not from spelling: "the guest's email" matches
`GUEST.email`; "the booking" matches `RESERVATION` when the model has no other candidate. Report:

- data a use case reads, shows, or records that matches no entity or attribute
- a rule that implies a constraint the model contradicts (a rule says "optional", the model says `Not Null`; a rule
  lists four statuses, the model's `Values:` lists three)
- a relationship a flow relies on that the model does not have

Skip this check when there is no entity model. Severity: `warning`.

## 8. Trigger and preconditions

**Where:** the Overview's `**Trigger:**` line (German: `**Auslösendes Ereignis:**`) and the Preconditions of each use
case.

The trigger is the event that starts the use case — an actor's request, a point in time, a message from an external
system. A precondition is a state that is already true and that the use case does not check again. Ask "when does
this happen?": an event has a moment, a state does not. Report:

- a trigger that is a state ("Flight data is available", "User is logged in") — it belongs in the Preconditions
- a precondition that is an event or an actor action ("User clicks New Order", "Dispatcher requests an assessment")
  — it is the trigger, or step 1
- a precondition that is established or evaluated during the use case — it depends on input given in a step ("A room
  is available for the requested dates" when the dates are entered in step 4), a step checks it, or an alternative
  flow handles its violation; then the fact is not a precondition but a condition the use case has to check, and the
  precondition should name only the stable state it rests on ("Room inventory is configured")
- a step 1 that repeats the trigger word for word instead of starting the interaction

A missing trigger line is `info` (older documents have none; `/use-case-spec` writes it for new ones). The validator
already flags an empty trigger, a `(step N)` in it, and a trigger that copies a precondition verbatim; report what
needs judgment. Severity: `warning` for a state written as a trigger, an event written as a precondition, or a
precondition the use case evaluates itself, `info` otherwise.
