# Development View

**Question:** How is the code organized, built, and tested?  
**Artifacts:** this document  
**Notation:** Markdown  
**For the agent:** read before writing code. The Layers table says which layer skill builds and tests each
technical layer: `/use-case-implement` runs the Skill column bottom-up, `/use-case-test` runs the Test skill column from the
integration layer up, and `/use-case-coverage` searches for the markers in the last table.

**Last updated:** 2026-09-30

## Layers

| Layer       | Technology  | Skill            | Test skill            | Location                                                     |
|-------------|-------------|------------------|-----------------------|--------------------------------------------------------------|
| Migration   | Flyway      | flyway-schema    | –                     | `hotel-persistence/src/main/resources/db/migration`          |
| Persistence | jOOQ        | jooq-persistence | jooq-persistence-test | `hotel-persistence`, package `com.example.hotel.persistence` |
| Service     | Spring Boot | spring-service   | spring-service-test   | `hotel-application`, package `com.example.hotel.application` |
| API         | Spring REST | spring-rest      | spring-rest-test      | `hotel-api`, package `com.example.hotel.api`                 |
| UI          | –           | –                | –                     | –                                                            |
| E2E         | –           | –                | –                     | –                                                            |

**Integration layer:** API — `spring-rest-test` runs in process against the real service and database.

A layer the project does not have is marked `–` in every column (a UI layer in a REST service). The integration
layer is the topmost layer whose tests run in process against the real database; its tests exercise every layer
below it, so `/use-case-test` runs its test skill and the ones above it and writes no tests of their own for the layers
below unless a run names them (`/use-case-test UC-001 persistence`). A use case whose `**Layers:**` line names only some
entry layers (`UI`, `API`, `Service`) is built only in those, and tested in the topmost in-process layer it uses.

## Module layout

Maven reactor with `hotel-domain`, `hotel-application`, `hotel-persistence`, `hotel-api`, and `hotel-app`
(composition root, integration tests). Root package `com.example.hotel`.

## API contract

REST/JSON under `/api`, errors as RFC 9457 Problem Details, request and response DTOs named `<Action><Entity>Request`
and `<Entity>Response`.

## Commands

| Purpose            | Command          |
|--------------------|------------------|
| Build              | `./mvnw verify`  |
| Unit tests         | `./mvnw test`    |
| Integration tests  | `./mvnw verify`  |
| End-to-end tests   | –                |

## Markers

Each layer skill keeps its own rows here: on every run it checks that the rows for its layer match its marker
reference and corrects them. Do not edit the rows by hand; rerun the layer skill instead.

| Layer | Skill | Kind | Marker to grep for |
|-------|-------|------|--------------------|
| All   | –     | Code | `// UC-XXX BR-YYY:` directly above the method, query condition, or validator that enforces the rule |
