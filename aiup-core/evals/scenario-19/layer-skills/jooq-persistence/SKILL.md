---
name: jooq-persistence
description: >
  Builds the persistence layer of a use case (UC-XXX) with jOOQ: one @Repository per aggregate with an injected
  DSLContext, type-safe queries against the classes jOOQ generates from the Flyway migrations, projections into
  Java records with Records.mapping, MULTISET for nested collections, paging and dynamic filters, optimistic locking
  when the entity has a version, and UC-XXX BR-YYY markers on the query conditions that enforce a business rule.
  Transactions stay with the service layer. Hands the repository method signatures and record types to the service
  layer. Normally run by /use-case-implement after the migration layer; can be run directly. Use when the user asks to
  "write the jOOQ repository", "implement the data access for UC-001", "add a jOOQ query", "map the result into a
  record", "set up jOOQ code generation", or mentions jOOQ, DSLContext, Records.mapping, multiset, or a repository
  in a project that combines layer plugins.
---

<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# jOOQ Persistence

## Instructions

Build the persistence layer of the use case $ARGUMENTS with jOOQ: one `@Repository` per aggregate with an injected
`DSLContext`, type-safe queries against the generated classes, and projections into Java records with
`Records.mapping`. Transactions belong to the service layer.

## Scope

- **Consumes** the Handover of the migration layer, or the existing migrations when run directly.
- **Produces** the repository methods and records the service layer calls.
- **Never touches** migrations, services, controllers, views, tests, or anything under `docs/` other than the
  Markers table of `docs/architecture/development.md`.

## Run Directly or from /use-case-implement

Run from `/use-case-implement`, this skill inherits the inputs that skill read, the gaps the user answered, and its
rules for reconciling an existing implementation; it does not repeat the status check or ask the same questions
again. Run directly, read the use case, the requirements it links, `docs/entity_model.md`, and
`docs/architecture/development.md` yourself, and stop on a `Draft` or `Reviewed` use case.

## Business Rule Markers

Put `// UC-XXX BR-YYY: <rule>` directly above the `.where(...)` / `.and(...)` condition or the query that enforces
the rule (an `exists` or `count` check the service decides on).

## Markers

Keep this skill's rows in the Markers table of `docs/architecture/development.md` exactly as
[references/markers.md](references/markers.md) lists them: add them when they are missing, correct them when they
differ. Touch no other row.

## Workflow

1. Read the migration Handover and the existing repositories; extend the repository of the aggregate when it exists.
2. Write the queries the use case's steps need, with records for their results.
3. Update the Markers table — see "Markers".
4. Report the files created or changed and end with the Handover.

## Handover

```text
Handover from jooq-persistence (UC-XXX)
- <Aggregate>Repository — src/main/java/<package>/<Aggregate>Repository.java
  - <return type> <method>(<parameters>)          — UC-XXX BR-YYY where it enforces a rule
- record <Name>(<fields>)
Nothing to do: <reason>   (when the existing repositories already serve the use case)
```
