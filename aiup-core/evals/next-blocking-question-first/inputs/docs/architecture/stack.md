# Stack

**For the agent:** read before writing code. This file is the AI Unified Process record of the technical layers,
independent of how the team documents its architecture. The Layers table says which layer skill builds and tests
each technical layer: `/use-case-implement` runs the Skill column bottom-up, `/use-case-test` runs the Test skill
column from the integration layer up, and `/use-case-coverage` searches for the markers in the last table.

**Last updated:** 2026-10-20

## Layers

| Layer       | Technology      | Skill             | Test skill             | Location                                                              |
|-------------|-----------------|-------------------|------------------------|-----------------------------------------------------------------------|
| Migration   | Flyway          | `flyway-schema`   | –                      | `src/main/resources/db/migration`                                     |
| Persistence | JPA             | `jpa-persistence` | `jpa-persistence-test` | `com.example.library.<feature>` (`<Entity>`, `<Entity>Repository`)    |
| Service     | Spring Boot     | `spring-service`  | `spring-service-test`  | `com.example.library.<feature>` (`<Entity>Service`)                   |
| API         | Spring MVC REST | `spring-rest`     | `spring-rest-test`     | `com.example.library.<feature>` (`<Entity>Controller`)                |
| UI          | –               | –                 | –                      | –                                                                     |
| E2E         | –               | –                 | –                      | –                                                                     |

**Integration layer:**

| Use case offered through | Tested in | Test skill            |
|--------------------------|-----------|-----------------------|
| API                      | API       | `spring-rest-test`    |
| Service                  | Service   | `spring-service-test` |

A layer the project does not have is marked `–` in every column (a UI layer in a REST service). The Integration
layer table keeps only the rows of the entry layers the project has — a REST service drops the UI row — and its
Test skill column names what the Layers table names for that layer (`–` while the skill is not installed). A use
case is tested in the first row its `**Layers:**` line names, or in the first row when it has no such line. That layer's tests run in process against the real database
and exercise every layer below it, so `/use-case-test` runs its test skill and the ones above it and writes no tests
of their own for the layers below unless a run names them (`/use-case-test UC-001 persistence`).

## Module layout

Flat single module, root package `com.example.library`, one feature package per aggregate (`member`, `loan`). A
feature package holds its entity, Spring Data repository, service, records, domain exceptions, and controller. Tests
mirror the packages under `src/test/java`; test data lives in `src/test/resources/db/migration` as repeatable `R__`
migrations.

## API contract

REST/JSON under `/api`, used by the library app of another team. Errors are RFC 9457 Problem Details
(`application/problem+json`): `409` for a rejected business rule, `404` for an entity that does not exist, `400` for
invalid input with an `errors` entry per field. Request and response records are named `<Entity>Request` /
`<Entity>Response`. No OpenAPI document is generated.

## Commands

| Purpose            | Command                      |
|--------------------|------------------------------|
| Build              | `./mvnw -DskipTests package` |
| Unit tests         | `./mvnw test`                |
| Integration tests  | `./mvnw verify`              |

## Markers

Each layer skill keeps its own rows here: on every run it checks that the rows for its layer match its marker
reference and corrects them. Do not edit the rows by hand; rerun the layer skill instead.

| Layer | Skill | Kind | Marker to grep for |
|-------|-------|------|--------------------|
| All   | –     | Code | `// UC-XXX BR-YYY:` directly above the method, query condition, or validator that enforces the rule |
