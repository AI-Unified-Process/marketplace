# Stack

**For the agent:** read before writing code. This file is the AI Unified Process record of the technical layers,
independent of how the team documents its architecture. The Layers table says which layer skill builds and tests
each technical layer: `/use-case-implement` runs the Skill column bottom-up, `/use-case-test` runs the Test skill
column from the integration layer up, and `/use-case-coverage` searches for the markers in the last table.

**Last updated:** 2026-09-12

## Layers

| Layer       | Technology  | Skill            | Test skill            | Location                                   |
|-------------|-------------|------------------|-----------------------|--------------------------------------------|
| Migration   | Flyway      | flyway-schema    | –                     | `src/main/resources/db/migration`          |
| Persistence | jOOQ        | jooq-persistence | jooq-persistence-test | package `com.example.shop.persistence`     |
| Service     | Spring Boot | spring-service   | spring-service-test   | package `com.example.shop.service`         |
| API         | –           | –                | –                     | –                                          |
| UI          | Vaadin Flow | vaadin-flow-ui   | vaadin-flow-ui-test   | package `com.example.shop.ui`              |
| E2E         | Playwright  | –                | vaadin-e2e-test       | `src/test/java/com/example/shop/e2e`       |

**Integration layer:**

| Use case offered through | Tested in | Test skill |
|--------------------------|-----------|------------|
| UI                       | UI        | `vaadin-flow-ui-test` |
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

Flat single Maven module, root package `com.example.shop`.

## Commands

| Purpose            | Command          |
|--------------------|------------------|
| Build              | `./mvnw verify`  |
| Unit tests         | `./mvnw test`    |
| Integration tests  | `./mvnw verify`  |
| End-to-end tests   | `./mvnw verify`  |

## Markers

Each layer skill keeps its own rows here: on every run it checks that the rows for its layer match its marker
reference and corrects them. Do not edit the rows by hand; rerun the layer skill instead.

| Layer     | Skill         | Kind | Marker to grep for |
|-----------|---------------|------|--------------------|
| All       | –             | Code | `// UC-XXX BR-YYY:` directly above the method, query condition, or validator that enforces the rule |
| Migration | flyway-schema | Code | `-- UC-XXX BR-YYY:` directly above the `CHECK`, `UNIQUE`, index, or trigger that enforces the rule |
| Migration | flyway-schema | Name | `src/main/resources/db/migration/V*__*.sql`, named after the tables they change, never after a use case — search them by table and column |
