---
name: flyway-schema
description: >
  Builds the migration layer of a use case (UC-XXX) with Flyway: versioned V*.sql scripts with sequences, tables,
  snake_case columns, CHECK and UNIQUE constraints, and foreign keys from the entity model, placed in the migration
  location docs/architecture/stack.md records, and only the tables, columns, and constraints the use case needs that the
  schema does not have yet. Marks a constraint that enforces a business rule with -- UC-XXX BR-YYY. Normally run by
  /use-case-implement as the first layer; can be run directly, with a use case or for the whole entity model. Use when the
  user asks to "create a migration", "write a Flyway migration", "add a column", "create the tables for UC-001",
  "set up the database schema", or mentions Flyway, schema migration, DB migration, database versioning, or SQL
  migration files in a project that combines layer plugins. Test data migrations belong to the test skills.
---

<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# Flyway Schema

## Instructions

Create the versioned Flyway migrations that the use case $ARGUMENTS needs, from `docs/entity_model.md`.

## Scope

- **Consumes** the entity model and the existing migrations in `src/main/resources/db/migration/`.
- **Produces** new `V<n>__<description>.sql` files, named after the tables they change, never after a use case.
- **Never touches** an applied migration, Java code, tests, or anything under `docs/` other than the Markers table
  of `docs/architecture/stack.md`.

## Run Directly or from /use-case-implement

Run from `/use-case-implement`, this skill inherits the inputs that skill read, the gaps the user answered, and its
rules for reconciling an existing implementation; it does not repeat the status check or ask the same questions
again. Run directly, read the use case, the requirements it links, `docs/entity_model.md`, and
`docs/architecture/stack.md` yourself, and stop on a `Draft` or `Reviewed` use case.

## Business Rule Markers

A `CHECK`, `UNIQUE`, or index that enforces a business rule gets `-- UC-XXX BR-YYY: <rule>` on the line above it.

## Markers

Keep this skill's rows in the Markers table of `docs/architecture/stack.md` exactly as
[references/markers.md](references/markers.md) lists them: add them when they are missing, correct them when they
differ. Touch no other row.

## Workflow

1. Read the entity model and the existing migrations; take the next free version number.
2. Write only the tables, columns, and constraints the use case needs and the schema does not have yet. When the
   schema already has everything, write nothing and say so in the Handover.
3. Update the Markers table — see "Markers".
4. Report the files and end with the Handover.

## Handover

```text
Handover from flyway-schema (UC-XXX)
- V<n>__<description>.sql — src/main/resources/db/migration/
  - table <name> (<column> <type> <constraints>, …)
  - constraint <name> — UC-XXX BR-YYY
Nothing to do: <reason>   (when the schema already has everything the use case needs)
```
