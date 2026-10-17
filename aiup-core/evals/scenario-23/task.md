# Architecture of the Workshop Portal

## Problem/Feature Description

A training company builds a workshop registration portal: a Spring Boot backend with Spring Data JPA and Flyway in
the repository root, and an Angular single-page application in `frontend/` that calls the backend's JSON API. The
project follows the AI Unified Process; the requirements catalog, the entity model, and the use cases are under
`docs/`, all approved.

Before the first use case is implemented, the team wants the technical layers recorded, so that the construction
skills know which layer skills to run. The team wants browser tests for every use case offered through the UI as
well as for the end-to-end test cases.

## Output Specification

Write the Development View to `docs/architecture/development.md`, with the index `docs/architecture/README.md` of the
architecture views. Do not write any application code and do not change `pom.xml` or `frontend/package.json`.
