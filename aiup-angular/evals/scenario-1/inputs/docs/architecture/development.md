# Development View

**Question:** How is the code organized, built, and tested?  
**Artifacts:** this document  
**Notation:** Markdown  
**For the agent:** read before writing code. The Layers table says which layer skill builds and tests each
technical layer: `/use-case-implement` runs the Skill column bottom-up, `/use-case-test` runs the Test skill column from the
integration layer up, and `/use-case-coverage` searches for the markers in the last table.

**Last updated:** 2026-10-01

## Layers

| Layer       | Technology        | Skill            | Test skill           | Location                                  |
|-------------|-------------------|------------------|----------------------|-------------------------------------------|
| Migration   | Flyway            | flyway-schema    | –                    | backend/src/main/resources/db/migration   |
| Persistence | Spring Data JPA   | jpa-persistence  | jpa-persistence-test | backend/src/main/java/com/example/hotel   |
| Service     | Spring Boot       | spring-service   | spring-service-test  | backend/src/main/java/com/example/hotel   |
| API         | Spring MVC (REST) | spring-rest      | spring-rest-test     | backend/src/main/java/com/example/hotel   |
| UI          | Angular 20        | angular-ui       | angular-ui-test      | frontend/src/app                          |
| E2E         | Playwright        | –                | playwright-e2e-test  | frontend/tests/e2e                        |

**Integration layer:**

| Use case offered through | Tested in | Test skill |
|--------------------------|-----------|------------|
| UI                       | API       | `spring-rest-test` |
| API                      | API       | `spring-rest-test` |
| Service                  | Service   | `spring-service-test` |

A layer the project does not have is marked `–` in every column (a UI layer in a REST service). The Integration
layer table has a row per entry layer of the project: a use case is tested in the first row its `**Layers:**` line
names, or in the first row when it has no such line. That layer's tests run in process against the real database
and exercise every layer below it, so `/use-case-test` runs its test skill and the ones above it and writes no tests
of their own for the layers below unless a run names them (`/use-case-test UC-001 persistence`).

## Module layout

Flat Spring Boot backend in `backend/`, Angular standalone frontend in `frontend/` with zoneless change detection
(`provideZonelessChangeDetection()` in `app.config.ts`).

## API contract

REST/JSON under `/api`. Errors as RFC 9457 Problem Details; `detail` holds the message the UI shows.

## Commands

| Purpose            | Command                                        |
|--------------------|------------------------------------------------|
| Build              | `npm --prefix frontend run build`              |
| Unit tests         | `npm --prefix frontend test -- --watch=false`  |
| Integration tests  | `./mvnw -f backend verify`                     |
| End-to-end tests   | `npx --prefix frontend playwright test`        |

## Markers

Each layer skill keeps its own rows here: on every run it checks that the rows for its layer match its marker
reference and corrects them. Do not edit the rows by hand; rerun the layer skill instead.

| Layer | Skill | Kind | Marker to grep for |
|-------|-------|------|--------------------|
| All   | –     | Code | `// UC-XXX BR-YYY:` directly above the method, query condition, or validator that enforces the rule |
| UI    | angular-ui | Code | `/** UC-XXX: <Use Case Name> */` directly above the routed page component class |
| UI    | angular-ui | Code | `// UC-XXX BR-YYY:` directly above an Angular form validator, only for a rule the UI also validates |
| UI    | angular-ui | Name | page `src/app/pages/<page>/<page>.ts`, route in `app.routes.ts`, HTTP service `src/app/services/<entity>.ts` with `<entity>.model.ts` |
