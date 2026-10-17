# Development View

**Question:** How is the code organized, built, and tested?  
**Artifacts:** this document  
**Notation:** Markdown  
**For the agent:** read before writing code. The Layers table says which layer skill builds and tests each
technical layer: `/use-case-implement` runs the Skill column bottom-up, `/use-case-test` runs the Test skill column from the
integration layer up, and `/use-case-coverage` searches for the markers in the last table.

**Last updated:** 2026-10-02

## Layers

| Layer       | Technology | Skill | Test skill | Location |
|-------------|------------|-------|------------|----------|
| Migration   | Flyway | `flyway-schema` | – | `src/main/resources/db/migration` |
| Persistence | jOOQ | `jooq-persistence` | `jooq-persistence-test` | `com.example.workshops.<feature>` (`<Aggregate>Repository`) |
| Service     | Spring Boot | `spring-service` | `spring-service-test` | `com.example.workshops.<feature>` (`<Entity>Service`) |
| API         | – | – | – | – |
| UI          | Vaadin Flow | `vaadin-flow-ui` | `vaadin-flow-ui-test` | `com.example.workshops.<feature>` (`<Name>View`) |
| E2E         | Playwright for Java, Drama Finder | – | `vaadin-e2e-test` | `src/test/java/com/example/workshops/e2e` |

**Integration layer:**

| Use case offered through | Tested in | Test skill |
|--------------------------|-----------|------------|
| UI                       | UI        | `vaadin-flow-ui-test` |
| Service                  | Service   | `spring-service-test` |

A layer the project does not have is marked `–` in every column (a UI layer in a REST service). The Integration
layer table has a row per entry layer of the project: a use case is tested in the first row its `**Layers:**` line
names, or in the first row when it has no such line. That layer's tests run in process against the real database
and exercise every layer below it, so `/use-case-test` runs its test skill and the ones above it and writes no tests
of their own for the layers below unless a run names them (`/use-case-test UC-001 persistence`).

## Module layout

Flat single module, root package `com.example.workshops`, one feature package per aggregate (`workshop`,
`registration`). A feature package holds its repository, service, records, domain exceptions, and the entry points
of its use cases. Tests mirror the packages under `src/test/java`; test data lives in
`src/test/resources/db/testdata`.

## Commands

| Purpose            | Command |
|--------------------|---------|
| Build              | `./mvnw -DskipTests package` |
| Unit tests         | `./mvnw test` |
| Integration tests  | `./mvnw verify` |
| End-to-end tests   | `./mvnw verify -Dit.test='*IT'` |

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
| UI    | vaadin-flow-ui | Code | `UC-XXX` in the view's class Javadoc (`/** UC-XXX <Use Case Name>. */`)                                 |
| UI    | vaadin-flow-ui | Code | `// UC-XXX BR-YYY:` directly above the `Binder` validator or UI guard that enforces the rule            |
| UI    | vaadin-flow-ui | Name | `@Route` view class `<Name>View` named after the use case (`ManagePersonsView` for "Manage Persons")    |
| UI    | vaadin-flow-ui-test | Test | `@UseCase(id = "UC-XXX", scenario = "…", businessRules = {"BR-YYY"})` on every Browserless test method     |
| UI    | vaadin-flow-ui-test | Name | `UC<id><Name>Test`, e.g. `UC001ManagePersonsTest`, extending `SpringBrowserlessTest`                       |
| E2E   | vaadin-e2e-test | Test | `@DisplayName("UC-XXX: …")` on the class and one `@Nested` `@DisplayName("A<n>: …")` per alternative flow |
| E2E   | vaadin-e2e-test | Test | `@DisplayName("TC-XXX: …")` and one `// Step <n>: <name>` comment per Flow row                         |
| E2E   | vaadin-e2e-test | Name | `UC<id><Name>IT` for a use case, `TC<id><Name>IT` for a test case journey                             |
