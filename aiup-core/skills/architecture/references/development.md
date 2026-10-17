# Development View

**Question:** How is the code organized, built, and tested?  
**Artifacts:** this document  
**Notation:** Markdown  
**For the agent:** read before writing code. The Layers table says which layer skill builds and tests each
technical layer: `/use-case-implement` runs the Skill column bottom-up, `/use-case-test` runs the Test skill column from the
integration layer up, and `/use-case-coverage` searches for the markers in the last table.

**Last updated:** YYYY-MM-DD

## Layers

| Layer       | Technology | Skill | Test skill | Location |
|-------------|------------|-------|------------|----------|
| Migration   |            |       | –          |          |
| Persistence |            |       |            |          |
| Service     |            |       |            |          |
| API         |            |       |            |          |
| UI          |            |       |            |          |
| E2E         |            | –     |            |          |

**Integration layer:**

| Use case offered through | Tested in | Test skill |
|--------------------------|-----------|------------|
| UI                       |           |            |
| API                      |           |            |
| Service                  |           |            |

A layer the project does not have is marked `–` in every column (a UI layer in a REST service). The Integration
layer table has a row per entry layer of the project: a use case is tested in the first row its `**Layers:**` line
names, or in the first row when it has no such line. That layer's tests run in process against the real database
and exercise every layer below it, so `/use-case-test` runs its test skill and the ones above it and writes no tests
of their own for the layers below unless a run names them (`/use-case-test UC-001 persistence`).

**E2E scope:** Use cases and test cases

`Use cases and test cases`: `/use-case-test` adds a browser test to every use case offered through the UI, and
`/test-case-implement` automates the TC-* journeys. `Test cases only`: browser tests are written for the journeys
alone, and a use case is tested in its integration layer. A project without an E2E layer drops the line.

## Module layout

<!-- Flat single module or hexagonal multi-module; the root package; where each layer's code and tests live. -->

## API contract

<!-- Only when the project has an API layer: style (REST/JSON), base path, error format (e.g. RFC 9457 Problem
Details), how DTOs are named, whether an OpenAPI document is generated. Delete the section otherwise. -->

## Commands

| Purpose            | Command |
|--------------------|---------|
| Build              |         |
| Unit tests         |         |
| Integration tests  |         |
| End-to-end tests   |         |

## Markers

Each layer skill keeps its own rows here: on every run it checks that the rows for its layer match its marker
reference and corrects them. Do not edit the rows by hand; rerun the layer skill instead.

| Layer | Skill | Kind | Marker to grep for |
|-------|-------|------|--------------------|
| All   | –     | Code | `// UC-XXX BR-YYY:` directly above the method, query condition, or validator that enforces the rule |
