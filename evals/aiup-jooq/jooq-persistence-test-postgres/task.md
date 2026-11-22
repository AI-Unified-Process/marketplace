# Write the Persistence Tests of "Browse Product Catalog" (UC-010)

## Problem Description

An online shop combines Flyway, jOOQ, Spring Boot services, and a Spring REST API. `ProductRepository` implements the
data access of UC-010: a catalog query with an optional category filter, the in-stock rule, ordering by name, paging,
and a count. The project has a `TestcontainersConfiguration` for PostgreSQL in its test sources but no tests, no test
data, and no `UseCase` annotation yet.

The use case is `docs/use_cases/UC-010-browse-product-catalog.md`; `docs/architecture/stack.md` records the layers.

## Output Specification

Run the persistence test skill for UC-010 directly (as `/jooq-persistence-test UC-010` would): write the repository
test class, the test data it needs, and whatever the tests need to compile, keep the Markers table current, and end
with your report and the hand-off line.

You cannot run Docker or Maven in this environment; say so instead of claiming the tests pass.

This session's conversation is not kept. Append every message you write to the user, word for word and in order, to
`session-log.md` in the root of the working directory; that log is not part of the project.
