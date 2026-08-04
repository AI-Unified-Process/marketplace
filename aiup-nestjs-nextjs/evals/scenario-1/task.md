# Add the Supplier entity to the schema

## Problem Description

An online shop's NestJS + Drizzle project has two tables, `category` and `product`, created by the
single migration `apps/api/drizzle/migrations/0000_initial.sql`. That migration has **already been
applied** to the development, staging, and production databases, and its entry is recorded in
`apps/api/drizzle/migrations/meta/_journal.json`.

The entity model at `docs/entity_model.md` has since been updated. It now contains a `SUPPLIER`
entity and an optional relationship from `PRODUCT` to `SUPPLIER`, neither of which exists in the
schema yet.

The database is shared with the rest of the team, so the migration history has to stay intact and
replayable from scratch.

## Output Specification

Bring the database schema in line with the updated entity model:

1. Add the `SUPPLIER` entity, with the attributes, defaults, and validation rules the entity model
   states.
2. Add the optional `PRODUCT` → `SUPPLIER` relationship described in the entity model.
3. Produce the migration that applies these changes to a database that already has
   `0000_initial.sql` applied.
