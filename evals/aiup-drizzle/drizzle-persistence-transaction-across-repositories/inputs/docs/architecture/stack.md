# Stack

**For the agent:** read before writing code. This file is the AI Unified Process record of the technical layers,
independent of how the team documents its architecture. The Layers table says which layer skill builds and tests
each technical layer: `/use-case-implement` runs the Skill column bottom-up, `/use-case-test` runs the Test skill
column from the integration layer up, and `/use-case-coverage` searches for the markers in the last table.

**Last updated:** 2026-10-30

## Layers

| Layer       | Technology | Skill               | Test skill               | Location                  |
|-------------|------------|---------------------|--------------------------|---------------------------|
| Migration   | Drizzle    | drizzle-schema      | –                        | `apps/api/src/database`   |
| Persistence | Drizzle    | drizzle-persistence | drizzle-persistence-test | `apps/api/src/<feature>`  |
| Client      | –          | –                   | –                        | –                         |
| Service     | NestJS     | nest-service        | nest-service-test        | `apps/api/src/<feature>`  |
| API         | NestJS     | nest-rest           | nest-rest-test           | `apps/api/src/<feature>`  |
| UI          | –          | –                   | –                        | –                         |
| E2E         | –          | –                   | –                        | –                         |

**Integration layer:**

| Use case offered through | Tested in | Test skill |
|--------------------------|-----------|------------|
| API                      | API       | `nest-rest-test` |
| Service                  | Service   | `nest-service-test` |

A layer the project does not have is marked `–` in every column (a UI layer in a REST service). The Integration
layer table keeps a row only when the project has that layer — a REST service drops the UI row, a Vaadin Flow
project without a service layer drops the Service row. Its Test skill column names
what the Layers table names for the layer in Tested in (`–` while the skill is not installed). A use
case is tested in the first row its `**Layers:**` line names, or in the first row when it has no such line. That layer's tests run in process against the real database
and exercise every layer below it, so `/use-case-test` runs its test skill and the ones above it and writes no tests
of their own for the layers below unless a run names them (`/use-case-test UC-001 persistence`).

## Module layout

npm workspace with the NestJS app in `apps/api`, ESM with NodeNext, one folder per feature under `src/`.

## API contract

REST/JSON under `/api`; the project's exception filter maps domain errors to status codes; code-first.

## Commands

| Purpose           | Command                        |
|-------------------|--------------------------------|
| Build             | `npm run build -w api`         |
| Unit tests        | `npm test -w api`              |
| Integration tests | `npm run test:e2e -w api`      |
| End-to-end tests  | –                              |

## Markers

Each layer skill keeps its own rows here: on every run it checks that the rows for its layer match its marker
reference and corrects them. Do not edit the rows by hand; rerun the layer skill instead.

| Layer | Skill | Kind | Marker to grep for |
|-------|-------|------|--------------------|
| All   | –     | Code | `// UC-XXX BR-YYY:` directly above the method, query condition, or validator that enforces the rule |
