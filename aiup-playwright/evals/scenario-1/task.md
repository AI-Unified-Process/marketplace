# Bring the End-to-End Tests of "Register Guest" (UC-020) up to Date

## Problem Description

A hotel application combines layer plugins (Flyway, JPA, Spring Boot, Angular, Playwright), as recorded in
`docs/architecture/development.md`. An early end-to-end test for UC-020 exists at `frontend/e2e/UC-020-register-guest.spec.ts`;
it was written before the specification was approved and before the team adopted the AI Unified Process markers.
The use case is `docs/use_cases/UC-020-register-guest.md`. The application is not running in this environment.

## Output Specification

Make the end-to-end tests of UC-020 match the current specification, covering the main success scenario and A1.
Keep `docs/architecture/development.md` up to date as the E2E test skill requires. Do not change production code. Since the
application cannot be started here, say so in the report instead of claiming the tests pass.
