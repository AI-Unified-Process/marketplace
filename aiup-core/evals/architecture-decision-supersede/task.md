# Catalog Search Decision for the City Library

## Problem/Feature Description

A city library builds its new lending and catalog system with the AI Unified Process. The requirements are in
`docs/requirements.md`, and the team records its architecture decisions under `docs/architecture/decisions/`.

The architect, L. Brunner, sends this message after the load test:

> Please supersede ADR-002. The load test last week ran the catalog search against 500,000 titles, and the
> `ILIKE '%term%'` queries took 3 to 4 seconds for the first page.
>
> The architecture board decided today: the catalog search switches to PostgreSQL full-text search. The `book` table
> gets a generated `tsvector` column over title and author with a GIN index, and the search uses
> `websearch_to_tsquery`. Elasticsearch stays out for the reasons we wrote down in ADR-003.

## Output Specification

Record the decision under `docs/architecture/decisions/`. Today is 2026-10-27. L. Brunner has confirmed the decision
as taken and the change to ADR-002; nobody can answer follow-up questions in this session.

This session's conversation is not kept. Append every message you write to the user, word for word and in order, to
`session-log.md` in the root of the working directory; that log is not part of the project.
