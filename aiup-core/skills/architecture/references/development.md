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

**Integration layer:** <Layer> — `<test skill>` runs in process against the real service and database.

A layer the project does not have is marked `–` in every column (a UI layer in a REST service). The integration
layer is the topmost layer whose tests run in process against the real database; its tests exercise every layer
below it, so `/use-case-test` runs its test skill and the ones above it and writes no tests of their own for the layers
below unless a run names them (`/use-case-test UC-001 persistence`). A use case whose `**Layers:**` line names only some
entry layers (`UI`, `API`, `Service`) is built only in those, and tested in the topmost in-process layer it uses.

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
