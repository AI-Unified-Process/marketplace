# Stack

**For the agent:** read before writing code. This file is the AI Unified Process record of the technical layers,
independent of how the team documents its architecture. The Layers table says which layer skill builds and tests
each technical layer: `/use-case-implement` runs the Skill column bottom-up, `/use-case-test` runs the Test skill
column from the integration layer up, and `/use-case-coverage` searches for the markers in the last table.

**Last updated:** 2026-10-01

## Layers

| Layer       | Technology               | Skill            | Test skill            | Location                                                 |
|-------------|--------------------------|------------------|-----------------------|----------------------------------------------------------|
| Migration   | Flyway                   | flyway-schema    | –                     | `src/main/resources/db/migration`                        |
| Persistence | jOOQ                     | jooq-persistence | jooq-persistence-test | `com.example.hotel.<feature>`                            |
| Service     | Spring Boot 4            | spring-service   | spring-service-test   | `com.example.hotel.<feature>`                            |
| API         | –                        | –                | –                     | –                                                        |
| UI          | Hilla 25.1 (React)       | hilla-ui         | hilla-ui-test         | `src/main/frontend/views`, `com.example.hotel.<feature>` |
| E2E         | Playwright, Drama Finder | –                | vaadin-e2e-test       | `src/test/java/com/example/hotel/e2e`                    |

**Integration layer:**

| Use case offered through | Tested in | Test skill |
|--------------------------|-----------|------------|
| UI                       | Service   | `spring-service-test` |
| Service                  | Service   | `spring-service-test` |

A layer the project does not have is marked `–` in every column (a UI layer in a REST service). The Integration
layer table keeps only the rows of the entry layers the project has — a REST service drops the UI row — and its
Test skill column names what the Layers table names for that layer (`–` while the skill is not installed). A use
case is tested in the first row its `**Layers:**` line names, or in the first row when it has no such line. That layer's tests run in process against the real database
and exercise every layer below it, so `/use-case-test` runs its test skill and the ones above it and writes no tests
of their own for the layers below unless a run names them (`/use-case-test UC-001 persistence`).

**E2E scope:** Use cases and test cases

`Use cases and test cases`: `/use-case-test` adds a browser test to every use case offered through the UI, and
`/test-case-implement` automates the TC-* journeys. `Test cases only`: browser tests are written for the journeys
alone, and a use case is tested in its integration layer. A project without an E2E layer drops the line.

## Module layout

Flat single Maven module, root package `com.example.hotel`, one package per feature (`com.example.hotel.guest`);
Hilla endpoints in their feature package, React views under `src/main/frontend/views`.
Tests mirror the packages under `src/test/java`; test data is a versioned Flyway migration in
`src/test/resources/db/migration`.

## Commands

| Purpose            | Command                    |
|--------------------|----------------------------|
| Build              | `./mvnw compile`           |
| Unit tests         | `./mvnw test`              |
| Integration tests  | `./mvnw verify`            |
| End-to-end tests   | `./mvnw verify -Pit`       |

## Markers

Each layer skill keeps its own rows here: on every run it checks that the rows for its layer match its marker
reference and corrects them. Do not edit the rows by hand; rerun the layer skill instead.

| Layer       | Skill               | Kind | Marker to grep for                                                                                                                                                                  |
|-------------|---------------------|------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| All         | –                   | Code | `// UC-XXX BR-YYY:` directly above the method, query condition, or validator that enforces the rule                                                                                 |
| Migration   | flyway-schema       | Code | `-- UC-XXX BR-YYY:` directly above the `CHECK`, `UNIQUE`, index, or trigger that enforces the rule                                                                                  |
| Migration   | flyway-schema       | Name | `src/main/resources/db/migration/V*__*.sql`, named after the tables they change, never after a use case — search them by table and column                                           |
| Persistence | jooq-persistence    | Code | `// UC-XXX BR-YYY:` directly above the jOOQ `.where(...)`/`.and(...)` condition or query that enforces the rule                                                                     |
| Persistence | jooq-persistence    | Name | `<Aggregate>Repository` (`@Repository` with a `DSLContext`, or the adapter implementing that outbound port in a hexagonal layout), named after the aggregate root, never a use case |
| Service     | spring-service      | Code | `// UC-XXX BR-YYY:` directly above the service method or guard clause that enforces the rule                                                                                        |
| Service     | spring-service      | Code | `UC-XXX` in the Javadoc of the public service method that realizes a step or an alternative flow                                                                                    |
| Service     | spring-service      | Name | `<Entity>Service` classes annotated `@Service`; domain exceptions `<Reason>Exception`                                                                                               |
| Service | spring-service-test | Test | `@UseCase(id = "UC-XXX", scenario = "…", businessRules = {"BR-YYY"}, requirements = {"NFR-XXX"})` on every service test method   |
| Service | spring-service-test | Name | `UC<id><Name>ServiceTest`, e.g. `UC001RegisterGuestServiceTest`                                      |
| UI          | hilla-ui            | Code | `UC-XXX` in the view's file comment and the endpoint's class Javadoc                                                                                                                |
| UI          | hilla-ui            | Code | `// UC-XXX BR-YYY:` directly above the `useForm` field validator or UI guard in the `.tsx` view that enforces the rule                                                              |
| UI          | hilla-ui            | Name | view file `src/main/frontend/views/<route>.tsx` exporting `<Name>View`; `@BrowserCallable` class `<Entity>Endpoint`                                                                 |
