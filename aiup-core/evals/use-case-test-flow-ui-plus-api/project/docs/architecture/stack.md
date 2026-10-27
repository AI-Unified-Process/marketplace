# Stack

**For the agent:** read before writing code. This file is the AI Unified Process record of the technical layers,
independent of how the team documents its architecture. The Layers table says which layer skill builds and tests
each technical layer: `/use-case-implement` runs the Skill column bottom-up, `/use-case-test` runs the Test skill
column from the integration layer up, and `/use-case-coverage` searches for the markers in the last table.

**Last updated:** 2026-10-02

## Layers

| Layer       | Technology | Skill | Test skill | Location |
|-------------|------------|-------|------------|----------|
| Migration   | Flyway | `flyway-schema` | – | `src/main/resources/db/migration` |
| Persistence | jOOQ | `jooq-persistence` | `jooq-persistence-test` | `com.example.workshops.<feature>` (`<Aggregate>Repository`) |
| Service     | Spring Boot | `spring-service` | `spring-service-test` | `com.example.workshops.<feature>` (`<Entity>Service`) |
| API         | Spring MVC REST | `spring-rest` | `spring-rest-test` | `com.example.workshops.<feature>` (`<Entity>Controller`) |
| UI          | Vaadin Flow | `vaadin-flow-ui` | `vaadin-flow-ui-test` | `com.example.workshops.<feature>` (`<Name>View`) |
| E2E         | – | – | – | – |

**Integration layer:**

| Use case offered through | Tested in | Test skill |
|--------------------------|-----------|------------|
| UI                       | UI        | `vaadin-flow-ui-test` |
| API                      | API       | `spring-rest-test` |
| Service                  | Service   | `spring-service-test` |

A layer the project does not have is marked `–` in every column (a UI layer in a REST service). The Integration
layer table keeps only the rows of the entry layers the project has — a REST service drops the UI row — and its
Test skill column names what the Layers table names for that layer (`–` while the skill is not installed). A use
case is tested in the first row its `**Layers:**` line names, or in the first row when it has no such line. That layer's tests run in process against the real database
and exercise every layer below it, so `/use-case-test` runs its test skill and the ones above it and writes no tests
of their own for the layers below unless a run names them (`/use-case-test UC-001 persistence`).

## Module layout

Flat single module, root package `com.example.workshops`, one feature package per aggregate (`workshop`,
`registration`). A feature package holds its repository, service, records, domain exceptions, and the entry points
of its use cases. Tests mirror the packages under `src/test/java`; test data lives in
`src/test/resources/db/migration` as repeatable `R__` migrations.

## API contract

REST/JSON under `/api`. Errors are RFC 9457 Problem Details: `409` for a rejected business rule, `400` for invalid
input. Request and response records are named `<Entity>Request` / `<Entity>Response`. The API serves the partner portal; the Vaadin Flow views call the services directly.

## Commands

| Purpose            | Command |
|--------------------|---------|
| Build              | `./mvnw -DskipTests package` |
| Unit tests         | `./mvnw test` |
| Integration tests  | `./mvnw verify` |

## Markers

Each layer skill keeps its own rows here: on every run it checks that the rows for its layer match its marker
reference and corrects them. Do not edit the rows by hand; rerun the layer skill instead.

| Layer | Skill | Kind | Marker to grep for |
|-------|-------|------|--------------------|
| All   | –     | Code | `// UC-XXX BR-YYY:` directly above the method, query condition, or validator that enforces the rule |
| Migration | flyway-schema | Code | `-- UC-XXX BR-YYY:` directly above the `CHECK`, `UNIQUE`, index, or trigger that enforces the rule                    |
| Migration | flyway-schema | Name | `src/main/resources/db/migration/V*__*.sql`, named after the tables they change, never after a use case — search them by table and column |
| Persistence | jooq-persistence | Code | `// UC-XXX BR-YYY:` directly above the jOOQ `.where(...)`/`.and(...)` condition or query that enforces the rule |
| Persistence | jooq-persistence | Name | `<Aggregate>Repository` (`@Repository` with a `DSLContext`, or the adapter implementing that outbound port in a hexagonal layout), named after the aggregate root, never a use case |
| Service | spring-service | Code | `// UC-XXX BR-YYY:` directly above the service method or guard clause that enforces the rule         |
| Service | spring-service | Code | `UC-XXX` in the Javadoc of the public service method that realizes a step or an alternative flow     |
| Service | spring-service | Name | `<Entity>Service` classes annotated `@Service`; domain exceptions `<Reason>Exception`                 |
| API   | spring-rest | Code | `UC-XXX` in the Javadoc of the `@RestController` handler method that realizes a step or an alternative flow |
| API   | spring-rest | Code | `// UC-XXX BR-YYY:` directly above a request DTO constraint that repeats a rule the service enforces        |
| API   | spring-rest | Name | `<Entity>Controller` classes annotated `@RestController`; `<Entity>Request` / `<Entity>Response` records     |
| UI    | vaadin-flow-ui | Code | `UC-XXX` in the view's class Javadoc (`/** UC-XXX <Use Case Name>. */`)                                 |
| UI    | vaadin-flow-ui | Code | `// UC-XXX BR-YYY:` directly above the `Binder` validator or UI guard that enforces the rule            |
| UI    | vaadin-flow-ui | Name | `@Route` view class `<Name>View` named after the use case (`ManagePersonsView` for "Manage Persons")    |
