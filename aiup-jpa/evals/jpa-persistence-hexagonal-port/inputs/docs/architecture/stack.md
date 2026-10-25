# Stack

**Question:** How is the code organized, built, and tested?  
**Artifacts:** this document  
**Notation:** Markdown  
**For the agent:** read before writing code. The Layers table says which layer skill builds and tests each
technical layer: `/use-case-implement` runs the Skill column bottom-up, `/use-case-test` runs the Test skill column from the
integration layer up, and `/use-case-coverage` searches for the markers in the last table.

**Last updated:** 2026-10-01

## Layers

| Layer       | Technology               | Skill            | Test skill           | Location         |
|-------------|--------------------------|------------------|----------------------|------------------|
| Migration   | Flyway                   | flyway-schema    | –                    | `hotel-postgres` |
| Persistence | Spring Data JPA          | jpa-persistence  | jpa-persistence-test | `hotel-postgres` |
| Service     | Spring Boot              | spring-service   | spring-service-test  | `hotel-business` |
| API         | Spring MVC REST          | spring-rest      | spring-rest-test     | `hotel-api`      |
| UI          | –                        | –                | –                    | –                |
| E2E         | –                        | –                | –                    | –                |

**Integration layer:**

| Use case offered through | Tested in | Test skill |
|--------------------------|-----------|------------|
| API                      | API       | `spring-rest-test` |
| Service                  | Service   | `spring-service-test` |

A layer the project does not have is marked `–` in every column (a UI layer in a REST service). The Integration
layer table has a row per entry layer of the project: a use case is tested in the first row its `**Layers:**` line
names, or in the first row when it has no such line. That layer's tests run in process against the real database
and exercise every layer below it, so `/use-case-test` runs its test skill and the ones above it and writes no tests
of their own for the layers below unless a run names them (`/use-case-test UC-001 persistence`).

## Module layout

Hexagonal multi-module Maven reactor in `backend/`: `hotel-domain` (pure records), `hotel-business` (services and
outbound ports), `hotel-postgres` (JPA entities, Spring Data repositories, port implementations, Flyway migrations),
`hotel-api` (REST controllers), `hotel-app` (composition root). Root package `com.example.hotel`.

## API contract

REST/JSON under `/api`; errors as RFC 9457 Problem Details; request and response DTOs are records named `<Action><Entity>Request` and `<Entity>Response`; no generated OpenAPI document.

## Commands

| Purpose            | Command                       |
|--------------------|-------------------------------|
| Build              | `./mvnw -f backend compile`   |
| Unit tests         | `./mvnw -f backend test`      |
| Integration tests  | `./mvnw -f backend verify`    |
| End-to-end tests   | –                             |

## Markers

Each layer skill keeps its own rows here: on every run it checks that the rows for its layer match its marker
reference and corrects them. Do not edit the rows by hand; rerun the layer skill instead.

| Layer | Skill | Kind | Marker to grep for |
|-------|-------|------|--------------------|
| All   | –     | Code | `// UC-XXX BR-YYY:` directly above the method, query condition, or validator that enforces the rule |
