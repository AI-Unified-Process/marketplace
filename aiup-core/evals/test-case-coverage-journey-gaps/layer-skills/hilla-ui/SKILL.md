---
name: hilla-ui
description: >
  Implements the UI layer of a use case (UC-XXX) with Hilla: a @BrowserCallable endpoint that delegates to the
  service layer, and a React/TypeScript view under src/main/frontend/views/ with file-based routing, Vaadin React
  components, useForm validation from the generated models, and the messages the specification states. The
  endpoint is Hilla's API and belongs to this layer; it holds no business logic. Use when the user asks to
  "build the Hilla view for UC-001", "implement the UI layer with Hilla", "create a React view for Vaadin",
  "create a @BrowserCallable endpoint", or mentions Hilla, TSX views, file-based routing, or useForm in a project
  that combines layer plugins. Normally run by /use-case-implement after the service layer; it can be run directly. For
  server-side Java views use /vaadin-flow-ui.
---

<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# Hilla UI

## Instructions

Build the UI layer of the use case $ARGUMENTS with Hilla: a React view in `src/main/frontend/views/` and the
`@BrowserCallable` endpoint it calls, which delegates to the service of the service Handover.

## Scope

- **Consumes** the Handover of the service layer.
- **Produces** the endpoint, the view, its labels and messages.
- **Never touches** services, repositories, migrations, tests, or anything under `docs/` other than the Markers
  table of `docs/architecture/stack.md`.

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
Handover from hilla-ui (UC-XXX)
- Endpoint <Entity>Endpoint (@BrowserCallable) — methods <…>; EndpointException messages "<…>"
- View src/main/frontend/views/<route>.tsx
Nothing to do: <reason>
```
