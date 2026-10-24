---
name: jooq-persistence-test
description: >
  Writes the persistence layer tests of a use case (UC-XXX) for jOOQ repositories: integration tests against a real
  database (Testcontainers PostgreSQL or the project's database) with @SpringBootTest or @JooqTest, test data from
  Flyway test migrations, expected values from the specification and the test data, classes named
  UC<id><Name>RepositoryTest and every method annotated @UseCase. Tests only queries with logic of their own —
  filters, joins, projections, MULTISET, paging, optimistic locking — not what the integration layer's tests already
  cover. /use-case-test runs it only to reconcile existing tests, for queries the integration layer cannot reach, or when
  the persistence layer is named; can be run directly. Use when the user asks to "test the jOOQ
  repository", "write repository tests for UC-001", "test this query against the database", or mentions jOOQ
  repository tests, @JooqTest, DSLContext tests, or Testcontainers tests of the data access in a project that
  combines layer plugins.
---

<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# jOOQ Persistence Test

## Instructions

Write the repository tests of the use case $ARGUMENTS against a Testcontainers PostgreSQL database with the real
Flyway migrations. Name the class `UC<id><Name>RepositoryTest` and annotate every method with `@UseCase`.

## Run Directly or from /use-case-test

Run from `/use-case-test`, this skill follows that skill's sections "If Tests for This Use Case Already Exist",
"When a Test Fails", and "Which Layer Tests What"; it does not repeat them. The specification is the oracle: take
every expected value from it, never from what the code returns.

## What to Test

Every query the use case's steps run and every condition that carries a `UC-XXX BR-YYY` marker, with an allowed
and a rejected row. Below a Vaadin Flow, REST, or service integration layer these queries are already exercised;
`/use-case-test` runs this skill only when it is named or tests of this use case already exist here.

## Markers

Keep this skill's rows in the Markers table of `docs/architecture/stack.md` exactly as
[references/markers.md](references/markers.md) lists them: add them when they are missing, correct them when they
differ. Touch no other row.
