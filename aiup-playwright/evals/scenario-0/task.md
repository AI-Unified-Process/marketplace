# Automate the Journey "Register Guest and Book Room" (TC-001)

## Problem Description

A hotel application combines layer plugins (Flyway, JPA, Spring Boot, Angular, Playwright), as recorded in
`docs/architecture/development.md`. UC-020 and UC-030 are implemented and their unit and API tests exist. Playwright is already
set up in `frontend/` (see `frontend/playwright.config.ts`), but no end-to-end test exists yet.

The test case is `docs/test_cases/TC-001-register-guest-and-book-room.md`; it links the use cases in
`docs/use_cases/`. The application is not running in this environment.

## Output Specification

Write the end-to-end test of TC-001 with Playwright in TypeScript, in the project's E2E folder. Keep
`docs/architecture/development.md` up to date as the E2E test skill requires. Do not change production code. Since the
application cannot be started here, say so in the report instead of claiming the test passes.
