# Stack

**For the agent:** read before writing code. This file is the AI Unified Process record of the technical layers,
independent of how the team documents its architecture. The Layers table says which layer skill builds and tests
each technical layer: `/use-case-implement` runs the Skill column bottom-up, `/use-case-test` runs the Test skill
column from the integration layer up, and `/use-case-coverage` searches for the markers in the last table.

**Last updated:** 2026-10-01

## Layers

| Layer       | Technology        | Skill            | Test skill           | Location                                  |
|-------------|-------------------|------------------|----------------------|-------------------------------------------|
| Migration   | Flyway            | flyway-schema    | –                    | backend/src/main/resources/db/migration   |
| Persistence | Spring Data JPA   | jpa-persistence  | jpa-persistence-test | backend/src/main/java/com/example/hotel   |
| Service     | Spring Boot       | spring-service   | spring-service-test  | backend/src/main/java/com/example/hotel   |
| API         | Spring MVC (REST) | spring-rest      | spring-rest-test     | backend/src/main/java/com/example/hotel   |
| UI          | Angular 20        | angular-ui       | angular-ui-test      | frontend/src/app                          |
| E2E         | Playwright        | –                | playwright-e2e-test  | frontend/e2e                              |

**Integration layer:**

| Use case offered through | Tested in | Test skill |
|--------------------------|-----------|------------|
| UI                       | API       | `spring-rest-test` |
| API                      | API       | `spring-rest-test` |
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

Flat Spring Boot backend in `backend/`, Angular standalone frontend in `frontend/`. Schema migrations live in
`backend/src/main/resources/db/migration`; test seed data is a repeatable migration in
`backend/src/test/resources/db/migration`, which Flyway loads whenever the backend runs from its test classpath, as
it does for end-to-end tests. The Angular dev server (`http://localhost:4200`) proxies `/api/*` to the backend.

## API contract

REST/JSON under `/api`. Errors as RFC 9457 Problem Details. `GET /api/guests?email=…` returns the matching guests,
`DELETE /api/guests/{id}` and `DELETE /api/reservations/{id}` remove one record, `GET /api/reservations?guestId=…`
lists a guest's reservations.

## Commands

| Purpose            | Command                                        |
|--------------------|------------------------------------------------|
| Build              | `npm --prefix frontend run build`              |
| Unit tests         | `npm --prefix frontend test -- --watch=false`  |
| Integration tests  | `./mvnw -f backend verify`                     |
| End-to-end tests   | `npm --prefix frontend run e2e`                |

## Markers

Each layer skill keeps its own rows here: on every run it checks that the rows for its layer match its marker
reference and corrects them. Do not edit the rows by hand; rerun the layer skill instead.

| Layer | Skill | Kind | Marker to grep for |
|-------|-------|------|--------------------|
| All   | –     | Code | `// UC-XXX BR-YYY:` directly above the method, query condition, or validator that enforces the rule |
