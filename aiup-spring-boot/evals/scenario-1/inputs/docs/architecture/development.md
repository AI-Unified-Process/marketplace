# Development View

**Question:** How is the code organized, built, and tested?  
**Artifacts:** this document  
**Notation:** Markdown  
**For the agent:** read before writing code. The Layers table says which layer skill builds and tests each
technical layer: `/use-case-implement` runs the Skill column bottom-up, `/use-case-test` runs the Test skill column from the
integration layer up, and `/use-case-coverage` searches for the markers in the last table.

**Last updated:** 2026-10-01

## Layers

| Layer       | Technology  | Skill            | Test skill            | Location                        |
|-------------|-------------|------------------|-----------------------|---------------------------------|
| Migration   | Flyway      | flyway-schema    | –                     | src/main/resources/db/migration |
| Persistence | jOOQ        | jooq-persistence | jooq-persistence-test | src/main/java/com/example/hotel |
| Service     | Spring Boot | spring-service   | spring-service-test   | src/main/java/com/example/hotel |
| API         | Spring MVC  | spring-rest      | spring-rest-test      | src/main/java/com/example/hotel |
| UI          | –           | –                | –                     | –                               |
| E2E         | –           | –                | –                     | –                               |

**Integration layer:**

| Use case offered through | Tested in | Test skill |
|--------------------------|-----------|------------|
| API                      | API       | `spring-rest-test` |
| Service                  | Service   | `spring-service-test` |

A layer the project does not have is marked `–` in every column (a UI layer in a REST service). The Integration
layer table has a row per entry layer of the project: a use case is tested in the first row its `**Layers:**` line
names, or in the first row when it has no such line. That layer's tests run in process against the real database
and exercise every layer below it, so `/use-case-test` runs its test skill and the ones above it and writes no tests
of their own for the layers below unless a run names them (`/use-case-test UC-001 persistence`).

## Module layout

Flat single Maven module, Spring Boot 4.0, root package `com.example.hotel`, one package per feature
(`com.example.hotel.guest`). Tests in `src/test/java` under the same packages.

## API contract

REST over JSON, base path `/api/v1`, errors as RFC 9457 Problem Details (`application/problem+json`), DTOs named
`<Entity>Request` and `<Entity>Response`, no OpenAPI document.

## Commands

| Purpose            | Command          |
|--------------------|------------------|
| Build              | `./mvnw compile` |
| Unit tests         | `./mvnw test`    |
| Integration tests  | `./mvnw test`    |
| End-to-end tests   | –                |

## Markers

Each layer skill keeps its own rows here: on every run it checks that the rows for its layer match its marker
reference and corrects them. Do not edit the rows by hand; rerun the layer skill instead.

| Layer | Skill | Kind | Marker to grep for |
|-------|-------|------|--------------------|
| All   | –     | Code | `// UC-XXX BR-YYY:` directly above the method, query condition, or validator that enforces the rule |
| Migration | flyway-schema | Code | `-- UC-XXX BR-YYY:` directly above the `CHECK`, `UNIQUE`, index, or trigger that enforces the rule |
| Migration | flyway-schema | Name | `src/main/resources/db/migration/V*__*.sql`, named after the tables they change, never after a use case — search them by table and column |
| Persistence | jooq-persistence | Code | `// UC-XXX BR-YYY:` directly above the jOOQ `.where(...)`/`.and(...)` condition or query that enforces the rule |
| Persistence | jooq-persistence | Name | `<Aggregate>Repository` (`@Repository` with a `DSLContext`, or the adapter implementing that outbound port in a hexagonal layout), named after the aggregate root, never a use case |
| Service | spring-service | Code | `// UC-XXX BR-YYY:` directly above the service method or guard clause that enforces the rule |
| Service | spring-service | Code | `UC-XXX` in the Javadoc of the public service method that realizes a step or an alternative flow |
| Service | spring-service | Name | `<Entity>Service` classes annotated `@Service`; domain exceptions `<Reason>Exception` |
