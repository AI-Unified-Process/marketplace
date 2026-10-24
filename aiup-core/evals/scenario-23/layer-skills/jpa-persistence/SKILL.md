---
name: jpa-persistence
description: >
  Implements the persistence layer of a use case (UC-XXX) with Spring Data JPA and Hibernate: @Entity classes mapped
  onto the Flyway schema (ddl-auto=validate, never create or update), Spring Data JpaRepository interfaces, derived
  and @Query queries, interface and record projections, attribute converters, fetch joins and entity graphs against
  N+1 selects, and @Version optimistic locking. Detects a flat single-module or a hexagonal multi-module backend; in
  the hexagonal case it writes the persistence adapter and the outbound port it implements. No Lombok. Use when the
  user asks to "write the JPA entities", "create the repository for UC-001", "implement the persistence layer",
  "map the table to an entity", "fix the N+1 query", or mentions Spring Data JPA, Hibernate, @Entity, JpaRepository,
  or a persistence adapter. Normally run by /use-case-implement as the Persistence layer; it can also be run directly.
---

<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# JPA Persistence

## Instructions

Build the persistence layer of the use case $ARGUMENTS with Spring Data JPA: `@Entity` classes named after the
entity model, Spring Data repositories, and projections the service maps into records inside its transaction.

## Scope

- **Consumes** the Handover of the migration layer, or the existing migrations when run directly.
- **Produces** the entities, repositories, and query methods the service layer calls.
- **Never touches** migrations, services, controllers, views, tests, or anything under `docs/` other than the
  Markers table of `docs/architecture/stack.md`.

## Run Directly or from /use-case-implement

Run from `/use-case-implement`, this skill inherits the inputs that skill read, the gaps the user answered, and its
rules for reconciling an existing implementation; it does not repeat the status check or ask the same questions
again. Run directly, read the use case, the requirements it links, `docs/entity_model.md`, and
`docs/architecture/stack.md` yourself, and stop on a `Draft` or `Reviewed` use case.

## Business Rule Markers

Put `// UC-XXX BR-YYY: <rule>` directly above the repository query method, `exists…`/`count…` check, or `@Version`
field that enforces the rule.

## Markers

Keep this skill's rows in the Markers table of `docs/architecture/stack.md` exactly as
[references/markers.md](references/markers.md) lists them: add them when they are missing, correct them when they
differ. Touch no other row.

## Handover

```text
Handover from jpa-persistence (UC-XXX)
- <Entity> (@Entity) and <Entity>Repository — src/main/java/<package>/
  - <return type> <method>(<parameters>)
Nothing to do: <reason>
```
