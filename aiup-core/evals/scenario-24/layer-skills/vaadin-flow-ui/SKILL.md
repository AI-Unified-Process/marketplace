---
name: vaadin-flow-ui
description: >
  Implements the UI layer of a use case (UC-XXX) as server-side Java with Vaadin Flow: @Route views inside the
  application layout, Grids with lazy data providers that call the service layer, forms with Binder and Bean
  Validation, dialogs and ConfirmDialogs, notifications with the messages the specification states, navigation,
  and view access control for the roles the use case names. Calls the service layer directly — no REST layer,
  no jOOQ or JPA in a view. Use when the user asks to "build the Vaadin view for UC-001", "implement the UI layer
  with Vaadin Flow", "create a Vaadin form", "add a grid for this use case", or mentions @Route views, Binder,
  server-side Java UI, or Vaadin Flow in a project that combines layer plugins. Normally run by /use-case-implement
  after the service layer; it can be run directly. For Hilla (React) views use /hilla-ui.
---

<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# Vaadin Flow UI

## Instructions

Build the UI layer of the use case $ARGUMENTS with Vaadin Flow: a `@Route` view named after the use case, a form
bound with `Binder`, and a grid with lazy data, calling the service methods of the service Handover directly.

## Scope

- **Consumes** the Handover of the service layer. A Vaadin Flow view needs no API layer.
- **Produces** the view, its labels, messages, and test ids, for the UI and E2E tests.
- **Never touches** services, repositories, controllers, migrations, tests, or anything under `docs/` other than the
  Markers table of `docs/architecture/stack.md`. The view never uses a `DSLContext` or a repository.

## Run Directly or from /use-case-implement

Run from `/use-case-implement`, this skill inherits the inputs that skill read, the gaps the user answered, and its
rules for reconciling an existing implementation; it does not repeat the status check or ask the same questions
again. Run directly, read the use case, the requirements it links, `docs/entity_model.md`, and
`docs/architecture/stack.md` yourself, and stop on a `Draft` or `Reviewed` use case.

## Business Rule Markers

Name the use case in the view's class Javadoc (`/** UC-XXX <Use Case Name>. */`). A `Binder` validator or UI guard
that also checks a rule gets `// UC-XXX BR-YYY: <rule>` above it. Show the message of each domain exception as the
specification states it.

## Markers

Keep this skill's rows in the Markers table of `docs/architecture/stack.md` exactly as
[references/markers.md](references/markers.md) lists them: add them when they are missing, correct them when they
differ. Touch no other row.

## Handover

```text
Handover from vaadin-flow-ui (UC-XXX)
- View <Name>View @Route("<route>") — src/main/java/<package>/<Name>View.java
- Labels: <fields and buttons>
- Messages: "<message>" (step <n>), "<message>" (A<n>)
- Calls: <Entity>Service.<method>(…)
Nothing to do: <reason>   (when the use case has no UI)
```
