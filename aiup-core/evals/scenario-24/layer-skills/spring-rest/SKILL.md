---
name: spring-rest
description: >
  Implements the REST API layer of a use case (UC-XXX) in a Spring Boot application: @RestController endpoints on
  top of the service layer, request and response DTO records, @Valid input validation, error mapping to RFC 9457
  Problem Details with a @RestControllerAdvice, a status code per alternative flow, and paging. Takes the base path
  and contract style from the API contract section of docs/architecture/development.md; holds no business rule the service
  does not enforce. Use when the user asks to "build the REST API", "create an endpoint", "expose the use case over
  HTTP", "add a controller", "map errors to Problem Details", or mentions @RestController, @RequestMapping, DTOs,
  ProblemDetail, RFC 9457, status codes, or a JSON contract for a separate client such as Angular. Normally run by
  /use-case-implement after the service layer; it can also be run directly.
---

<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# Spring REST

## Instructions

Build the API layer of the use case $ARGUMENTS: a `@RestController` that maps requests to the service methods of the
service Handover, request and response records, and RFC 9457 Problem Details for every domain exception.

## Scope

- **Consumes** the Handover of the service layer.
- **Produces** endpoints with their JSON and statuses for the UI layer and other clients.
- **Never touches** services, repositories, migrations, views, tests, or anything under `docs/` other than the
  Markers table of `docs/architecture/development.md`. Holds no business rule the service does not enforce.

## Run Directly or from /use-case-implement

Run from `/use-case-implement`, this skill inherits the inputs that skill read, the gaps the user answered, and its
rules for reconciling an existing implementation; it does not repeat the status check or ask the same questions
again. Run directly, read the use case, the requirements it links, `docs/entity_model.md`, and
`docs/architecture/development.md` yourself, and stop on a `Draft` or `Reviewed` use case.

## Business Rule Markers

Name the use case in the Javadoc of each handler method. A request DTO constraint that repeats a rule the service
enforces gets `// UC-XXX BR-YYY: <rule>` above it.

## Markers

Keep this skill's rows in the Markers table of `docs/architecture/development.md` exactly as
[references/markers.md](references/markers.md) lists them: add them when they are missing, correct them when they
differ. Touch no other row.

## Handover

```text
Handover from spring-rest (UC-XXX)
- POST /api/<resources> → 201 <Entity>Response; 409 Problem Details for <Reason>Exception (A<n>)
- record <Entity>Request(<fields>), record <Entity>Response(<fields>)
Nothing to do: <reason>
```
