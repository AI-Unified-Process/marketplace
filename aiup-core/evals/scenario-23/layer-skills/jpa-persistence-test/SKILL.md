---
name: jpa-persistence-test
description: >
  Writes the persistence tests of a use case (UC-XXX) for Spring Data JPA: @DataJpaTest classes against a real
  database in a Testcontainers container (never H2 unless the project already tests on it), test data from Flyway
  test migrations, one UC<id><Name>RepositoryTest class per use case with @UseCase annotations. Tests only queries
  with logic of their own — filters, joins, projections, paging, fetch joins, custom @Query and Specification
  queries, attribute converters — and says so when the use case has none. In a hexagonal backend it tests through
  the persistence adapter in the adapter module. Use when the user asks to "test the repository", "write a
  @DataJpaTest", "test the JPA query of UC-001", "write persistence tests", or mentions DataJpaTest, repository
  tests, or Testcontainers for Spring Data JPA. /use-case-test runs it only to reconcile existing tests, for queries the
  integration layer cannot reach, or when the persistence layer is named; it can also be run directly.
---

<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# JPA Persistence Test

## Instructions

Write the `@DataJpaTest` repository tests of the use case $ARGUMENTS against a Testcontainers database. Name the
class `UC<id><Name>RepositoryTest` and annotate every method with `@UseCase`.

## Run Directly or from /use-case-test

Run from `/use-case-test`, this skill follows that skill's sections "If Tests for This Use Case Already Exist",
"When a Test Fails", and "Which Layer Tests What"; it does not repeat them. The specification is the oracle: take
every expected value from it, never from what the code returns.

## Markers

Keep this skill's rows in the Markers table of `docs/architecture/development.md` exactly as
[references/markers.md](references/markers.md) lists them: add them when they are missing, correct them when they
differ. Touch no other row.
