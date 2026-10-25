<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# Specifications — where each section comes from in the code

Read this before writing the specifications of stage 6. Every file follows the structure of `/use-case-spec`; this
page says how to recover each section from the code.

## Sections

- **Overview**: ID, name, primary actor (several comma-separated when
  different roles reach the same entry point for the same goal, e.g.
  two roles authorized on the same route), secondary actors (external
  systems the code calls for this use case — payment, mail, or map APIs,
  other internal services — and supporting roles; omit the line when
  there are none), goal, trigger (the event behind the entry point: a
  user action on a route or view for an interactive use case, the
  schedule of a `@Scheduled` job or cron task for a time trigger, the
  message or webhook a listener consumes for an external system's event),
  status (always `Draft`, even for working code: a recovered specification
  describes what the code does, not what it should do, and a test derived
  from it before a human has approved it only restates the code — see
  stage 9 of the skill). Add
  the `**Requirements:**` link (`[FR-001, NFR-002](../requirements.md)`)
  only when a `docs/requirements.md` already exists and its ids match the
  use case; otherwise omit the line — never invent requirement ids. Add
  a `**Layers:**` line only when the code offers the use case through
  fewer entry points than the system has: `UI` when only a view or route
  realizes it, `API` when only an endpoint does, `Service` when only a
  job or listener does.
- **Preconditions**: derive from auth checks, route guards, validation
  guards that fail fast, and required upstream state (e.g. "guest is
  registered" if the route requires a session). Preconditions are states,
  never the request that starts the use case — that is the trigger. A check
  the code performs on input the actor provides during the use case (e.g.
  availability for the chosen dates) is not a precondition: it becomes a
  step plus an alternative flow.
- **Main Success Scenario**: numbered steps written from the actor and
  system perspective — never naming framework methods, SQL, or HTTP verbs.
  Trace the happy path through the code and abstract each branch into a
  single business-level step.
- **Alternative Flows**: derive from `if/else` on validation, exception
  handlers, conditional UI flows, and tested error cases. Number them
  `A1`, `A2`, … and give each a clear trigger that names the step it
  diverges from. When the code has no such branch for the use case, write
  an italic placeholder (`_None — …_`) — never invent a flow the code does
  not have.
- **Postconditions**: success postconditions come from successful database
  writes, emitted events, sent emails, and returned redirects. Failure
  postconditions are the minimum guarantees that hold for every
  unsuccessful end — derive them from transaction boundaries, rollbacks,
  and checks that run before any write ("No order is stored"), never
  from error responses or messages, which belong in the alternative flows.
- **Business Rules**: extract from validation annotations, domain
  constants, configuration, and any `if (...)` that encodes a policy
  decision (limits, thresholds, eligibility). Number and cite them by
  rule 4 of the skill's format contract (`BR-001` again in every file, a
  rule of another use case cited as "UC-005 BR-002"). A policy the code enforces in several places is still one
  rule: write it in the use case that owns the data and cite it elsewhere
  instead of copying it.
  When `docs/glossary.md` exists, name actors and business objects with its
  terms, never with a synonym from its Avoid column.

The full template lives in the `/use-case-spec` skill of this plugin as
`references/use-case.md`, and the normative format definition next to it as
`references/format-spec.md`. Locate them with a glob for
`**/*use-case-spec/references/use-case.md` and `**/*use-case-spec/references/format-spec.md` —
the skill folder may carry a host prefix such as `tessl__use-case-spec`; never resolve the
paths against the project root or relative to this skill's folder.

## Step writing — what to keep at the business level

| Code reality                                  | Use case step                              |
|-----------------------------------------------|--------------------------------------------|
| `POST /reservations` returns `201`            | "System creates the reservation"           |
| `if (!cart.isEmpty()) { … }`                  | A1 trigger: "Cart is empty"                |
| `@NotNull` annotation on `email`              | BR: "Email is required"                    |
| `if (amount > 10_000) requireApproval()`      | BR: "Orders over 10,000 require approval"  |
| `mailService.send(confirmation)`              | "System sends a confirmation email"        |
| `throw new InsufficientStockException()`      | A2 trigger: "Requested quantity exceeds stock" |

If a step would only make sense to someone who has read the code, rewrite it.
