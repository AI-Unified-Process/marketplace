---
name: spring-service
description: >
  Implements the service layer of a use case (UC-XXX) in a Spring Boot application: @Service classes with
  constructor injection, @Transactional boundaries, the business rules with UC-XXX BR-YYY markers, domain exceptions
  for every rejection the API or UI turns into a message, and Bean Validation on the inputs. Calls the persistence
  layer only through the repository or port its Handover names, and supports both a flat single module and a
  hexagonal multi-module layout (domain record, business service, outbound port). Use when the user asks to
  "implement the service layer", "write the business logic", "enforce the business rules", "create a Spring
  service", "add transactions", or mentions @Service, @Transactional, domain exceptions, or the business module of
  a hexagonal Spring Boot project. Normally run by /use-case-implement after the persistence layer; it can also be run
  directly.
---

<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# Spring Service

## Instructions

Build the service layer of the use case $ARGUMENTS: a `@Service` with `@Transactional` methods that enforce the
business rules and throw a domain exception per alternative flow the service decides.

## Scope

- **Consumes** the Handover of the persistence layer: the repository, its methods, and the records they return.
- **Produces** the public service methods the layer above calls — a `@RestController`, a Vaadin Flow view, or a
  Hilla `@BrowserCallable` endpoint — with their input records, return types, and exceptions.
- **Never touches** queries, migrations, controllers, views, endpoints, tests, or anything under `docs/` other than
  the Markers table of `docs/architecture/stack.md`.

## Run Directly or from /use-case-implement

Run from `/use-case-implement`, this skill inherits the inputs that skill read, the gaps the user answered, and its
rules for reconciling an existing implementation; it does not repeat the status check or ask the same questions
again. Run directly, read the use case, the requirements it links, `docs/entity_model.md`, and
`docs/architecture/stack.md` yourself, and stop on a `Draft` or `Reviewed` use case.

## Business Rule Markers

Every business rule of the use case is enforced here, whatever else enforces it too. Put `// UC-XXX BR-YYY: <rule>`
directly above the guard clause or method that enforces it, and name the use case in the Javadoc of each public
method that realizes a step or an alternative flow. Read the time from an injected `Clock`.

## Markers

Keep this skill's rows in the Markers table of `docs/architecture/stack.md` exactly as
[references/markers.md](references/markers.md) lists them: add them when they are missing, correct them when they
differ. Touch no other row.

## Workflow

1. Read the persistence Handover; call only the repository methods it names.
2. Write the service methods, the input records with their Bean Validation constraints, and one domain exception
   per alternative flow, with the message the specification states.
3. Update the Markers table — see "Markers".
4. Report the files and end with the Handover.

## Handover

```text
Handover from spring-service (UC-XXX)
- <Entity>Service.<method>(<input>): <result> — src/main/java/<package>/<Entity>Service.java
  steps <n>–<m>; throws <Reason>Exception (A<n>, BR-YYY)
- Messages: <Reason>Exception "<message from the specification>"
Nothing to do: <reason>   (when the use case needs no service change)
```
