---
name: flyway-migration
description: Creates Flyway database migration scripts from the entity model.
---

# Flyway Migration

## Instructions

Create Flyway database migration scripts based on `docs/entity_model.md`.
Use sequences for primary keys.

## DO NOT

- Use auto-increment for primary keys (use sequences instead)
- Create migrations that drop existing tables without explicit user confirmation
- Skip foreign key constraints defined in the entity model

## Workflow

1. Read `docs/entity_model.md`
2. Read existing migrations to determine the next version number
3. Create sequence definitions for each entity
4. Create table definitions with columns, constraints, and foreign keys
5. Order tables so that referenced tables are created before referencing tables
6. Verify the migration is valid SQL
