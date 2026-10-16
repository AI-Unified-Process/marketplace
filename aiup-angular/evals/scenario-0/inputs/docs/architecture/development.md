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
| Persistence | Spring Data JPA   | jpa-persistence  | jpa-persistence-test | backend/src/main/java/com/example/shop    |
| Service     | Spring Boot       | spring-service   | spring-service-test  | backend/src/main/java/com/example/shop    |
| API         | Spring MVC (REST) | spring-rest      | spring-rest-test     | backend/src/main/java/com/example/shop    |
| UI          | Angular 20        | angular-ui       | angular-ui-test      | frontend/src/app                          |
| E2E         | Playwright        | –                | playwright-e2e-test  | frontend/tests/e2e                        |

**Integration layer:** API — `spring-rest-test` runs in process against the real service and database.

A layer the project does not have is marked `–` in every column (a UI layer in a REST service). The integration
layer is the topmost layer whose tests run in process against the real database; its tests exercise every layer
below it, so `/use-case-test` runs its test skill and the ones above it and writes no tests of their own for the layers
below unless a run names them (`/use-case-test UC-001 persistence`). A use case whose `**Layers:**` line names only some
entry layers (`UI`, `API`, `Service`) is built only in those, and tested in the topmost in-process layer it uses.

## Module layout

Flat single-module Spring Boot backend in `backend/` (root package `com.example.shop`), Angular standalone-component
frontend in `frontend/`, zoneless change detection.

## API contract

REST/JSON under `/api`. Errors as RFC 9457 Problem Details (`detail` holds the message). DTOs are Java records named
`<Entity>Dto`; `BigDecimal` is serialised as a JSON number.

## Commands

| Purpose            | Command                                   |
|--------------------|-------------------------------------------|
| Build              | `./mvnw -f backend package -DskipTests && npm --prefix frontend run build` |
| Unit tests         | `npm --prefix frontend test -- --watch=false` |
| Integration tests  | `./mvnw -f backend verify`                |
| End-to-end tests   | `npx --prefix frontend playwright test`   |

## Markers

Each layer skill keeps its own rows here: on every run it checks that the rows for its layer match its marker
reference and corrects them. Do not edit the rows by hand; rerun the layer skill instead.

| Layer | Skill | Kind | Marker to grep for |
|-------|-------|------|--------------------|
| All   | –     | Code | `// UC-XXX BR-YYY:` directly above the method, query condition, or validator that enforces the rule |
| UI    | angular-ui | Code | `// UC-XXX: …` somewhere in the component |
