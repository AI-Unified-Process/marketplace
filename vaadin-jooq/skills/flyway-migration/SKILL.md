---
name: flyway-migration
description: >
  Creates versioned Flyway database migration scripts (V*.sql) with sequences,
  tables, constraints, and foreign keys from the entity model. Use when the user
  asks to "create a migration", "generate SQL scripts", "set up database tables",
  "write a Flyway migration", or mentions schema migration, DB migration,
  database versioning, or SQL migration files.
---

# Flyway Migration

## Instructions

Create Flyway database migration scripts based on `docs/entity_model.md`.
Use sequences for primary keys.

## DO NOT

- Use auto-increment for primary keys (use sequences instead)
- Create migrations that drop existing tables without explicit user confirmation
- Skip foreign key constraints defined in the entity model

## File Naming Convention

Flyway versioned migrations follow this naming pattern:

```
V001__create_room_type_table.sql
V002__create_guest_table.sql
V003__create_reservation_table.sql
```

## Example Migration

```sql
-- V001__create_room_type_table.sql

CREATE SEQUENCE room_type_seq START WITH 1 INCREMENT BY 1 CACHE 50;

CREATE TABLE room_type
(
    id          BIGINT DEFAULT nextval('room_type_seq') PRIMARY KEY,
    name        VARCHAR(50)    NOT NULL UNIQUE,
    description VARCHAR(500),
    capacity    INTEGER        NOT NULL CHECK (capacity BETWEEN 1 AND 10),
    price       DECIMAL(10, 2) NOT NULL CHECK (price >= 0)
);
```

## Workflow

1. Read `docs/entity_model.md`
2. Read existing migrations to determine the next version number
3. Create sequence definitions for each entity
4. Create table definitions with columns, constraints, and foreign keys
5. Order tables so that referenced tables are created before referencing tables
6. Validate the migration:
    - Verify all entities from the entity model have corresponding tables
    - Verify all foreign keys reference tables that are created in the same or earlier migration
    - Verify sequence names follow the pattern `{table_name}_seq`
    - Verify the SQL syntax is valid for the target database
