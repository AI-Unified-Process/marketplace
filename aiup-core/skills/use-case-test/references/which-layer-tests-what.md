<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# Which Layer Tests What

The full rules behind the section of the same name in `/use-case-test`. Layer test skills that
refer to "Which Layer Tests What" of `/use-case-test` mean these rules.

## Per layer

The Integration layer table under the Layers table of `docs/architecture/stack.md` names, per entry layer, the
layer whose test skill runs in process against the real service and database. `/stack` derives it; look the
layer up, never derive it again. Its tests exercise every layer below it for real, so a use case is tested once,
there — not once per layer:

- **The integration layer tests the use case**: the main success scenario, every alternative flow, every business
  rule with its allowed and its rejected case at the boundary the rule names, the preconditions, the postconditions
  read back from the persisted state (not only as the view or the response shows them), and the limit of every
  linked NFR or constraint a test can observe — through its own entry point: the view, the endpoint, or the service
  method. A rule that needs a competing change (a stale version, a row inserted after the actor loaded the form)
  arranges that row through the repository after the load; this is the one exception to seeding data only through
  the test migrations. A flow whose trigger the shared test data rules out (an empty list, no row for a step to
  find) deletes those rows inside a test transaction that rolls back, when the entry point runs in the test's thread
  (Browserless, MockMvc, a direct service or repository call), and only when the flow reads. Never delete shared rows
  for good, and never check the flow's message while its trigger does not hold. Where the entry point runs in a
  server of its own (a live HTTP server, a browser), the flow is a unit that layer cannot reach.
- **The layers below it are not run**, with three exceptions. A second entry layer that runs in process tests its
  own contract (see below), also when it sits below the integration layer — the API next to a Vaadin Flow UI. A
  layer that already holds tests of this use case runs to reconcile them ("If Tests for This Use Case Already Exist" in `/use-case-test`) rather than leave them to go
  stale. And when the integration layer's test skill
  reports units it cannot reach through its entry point (a service method only a job calls, a query only another
  use case's view runs), the test skill of the layer that owns each unit runs for exactly those units. Otherwise a
  lower layer is written only when the arguments name it.
- **A UI layer above the integration layer** whose tests mock the backend (Hilla, Angular) tests what the UI
  decides and that a rejection reaches the actor with the specified message, not the rule again.
- **The E2E layer** tests the main success scenario and the alternative flows an actor sees, not every rule, and
  leaves out a flow the shared test data rules out, which the integration layer covers — and
  only when the `**E2E scope:**` line under the Integration layer table reads `Use cases and test cases` or is
  missing. `Test cases only` leaves browser tests to `/test-case-implement`: the use case gets none.
- **A second entry layer that also runs in process** — an API next to a Vaadin Flow or Hilla UI, both of which the
  use case offers — tests its own contract, not the use case again: the main success scenario through its entry point, every
  alternative flow's response or message as the caller sees it, and the input validation mapping. A business
  rule's allowed and rejected cases at the boundary stay in the integration layer.
- **When the service layer is the integration layer**, its tests use the integration style — the real persistence
  layer and database — even in a hexagonal project; the plain unit test with a fake port is written only when
  `service` is named. `/spring-service-test` states this.

When a layer has nothing of its own to test for this use case, its test skill says so instead of writing a test that
repeats another layer.

## The use case's own integration layer

The `**Layers:**` line of the use case (German `**Schichten:**`) names the
entry layers that offer it — `UI`, `API`, or `Service` alone; without the line, every entry layer of the project
does. The layers it leaves out get no tests, and E2E runs only when the use case is offered through the UI and the
E2E scope covers use cases. A
client-side UI that reaches the service through the API (Angular) implies its API layer: `UI` there runs the API
test skill too, as the integration layer (the layer catalog of `/stack`, "Entry layers of a use case"). An
entry layer the line names that the Layers table marks `–` is a contradiction between the specification and the
architecture: stop before the first layer and ask whether `/stack` adds the layer or `/use-case-spec UC-XXX`
corrects the line. The use case's integration layer is the first row of the Integration layer table that its
`**Layers:**` line names, in the table's order UI, API, Service; without the line, the first row. Name it in the
opening line.

## No Integration layer table

When the stack file has no Integration layer table — or only the one-line `**Integration layer:** <layer>` of an
earlier version, with no table under the label — do not derive the layer here: say so, stop, and hand off to `/stack`, which writes the
table without touching the rest of the file.
