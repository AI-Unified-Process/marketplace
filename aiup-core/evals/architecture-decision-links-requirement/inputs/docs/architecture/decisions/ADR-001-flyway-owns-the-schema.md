# ADR-001: Flyway owns the schema

**Status:** Accepted
**Date:** 2026-09-10
**Requirements:** C-001

## Context

C-001 fixes PostgreSQL and Flyway. Hibernate could create the schema on start-up, but then the schema in production
would be whatever the entities say on the day of the deployment.

## Decision

Every schema change is a versioned Flyway migration. Hibernate validates the schema and never changes it.

## Consequences

- The migrations are the history of the schema.
- **Alternatives considered:** Hibernate `ddl-auto=update` (no history, no review), Liquibase (C-001 names Flyway).
