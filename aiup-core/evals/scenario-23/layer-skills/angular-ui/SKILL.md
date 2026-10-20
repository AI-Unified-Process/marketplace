---
name: angular-ui
description: >
  Implements the UI layer of a use case (UC-XXX) as an Angular client: standalone page and presentational
  components, signal() state, one hand-written HttpClient service per entity with TypeScript models that match the
  API layer's DTOs field by field, and routes in app.routes.ts. Consumes the Handover of the API layer (endpoints,
  DTOs) and checks the JSON contract against it. Use when the user asks to "build the Angular page", "implement the
  UI of UC-001", "create the Angular component", "wire the frontend to the REST API", or mentions Angular, standalone
  components, signals, or an Angular client calling a backend. Normally run by /use-case-implement as the UI layer of a
  project whose docs/architecture/stack.md names Angular; it can also be run directly. Does not write tests — that is
  /angular-ui-test.
---

<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# Angular UI

## Instructions

Build the UI layer of the use case $ARGUMENTS with Angular: a routed page component, an HTTP service with its models
that match the API's DTOs field by field.

## Scope

- **Consumes** the Handover of the API layer.
- **Produces** the page, the route, the HTTP service and its models.
- **Never touches** the backend, tests, or anything under `docs/` other than the Markers table of
  `docs/architecture/stack.md`.

## Run Directly or from /use-case-implement

Run from `/use-case-implement`, this skill inherits the inputs that skill read, the gaps the user answered, and its
rules for reconciling an existing implementation; it does not repeat the status check or ask the same questions
again. Run directly, read the use case, the requirements it links, `docs/entity_model.md`, and
`docs/architecture/stack.md` yourself, and stop on a `Draft` or `Reviewed` use case.

## Markers

Keep this skill's rows in the Markers table of `docs/architecture/stack.md` exactly as
[references/markers.md](references/markers.md) lists them: add them when they are missing, correct them when they
differ. Touch no other row.

## Handover

```text
Handover from angular-ui (UC-XXX)
- Page src/app/pages/<page>/<page>.ts, route '<path>'
- Service src/app/services/<entity>.ts calling <endpoints>
Nothing to do: <reason>
```
