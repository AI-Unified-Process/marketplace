# ADR-002: Catalog search uses SQL LIKE queries on title and author

**Status:** Accepted
**Date:** 2026-09-12
**Requirements:** NFR-002, C-001

## Context

NFR-002 asks for the first page of a catalog search within 1 second. The catalog holds 120,000 titles today. C-001
fixes PostgreSQL 16 as the data store.

## Decision

The catalog search runs `ILIKE '%term%'` on the `title` and `author` columns of the `book` table and pages the result
with `LIMIT` and `OFFSET`.

## Consequences

- No extra index type, no extra column, no extra infrastructure.
- A pattern with a leading wildcard cannot use a B-tree index, so every search scans the table; acceptable at
  120,000 titles, to be measured again when the catalog grows.
- **Alternatives considered:** PostgreSQL full-text search (more setup, and stemming was not needed for title and
  author search at the time); Elasticsearch (a second data store next to PostgreSQL).
