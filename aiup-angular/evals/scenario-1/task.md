# Write the Angular UI Tests of "Register Guest" (UC-020)

## Problem Description

A hotel application combines layer plugins (Flyway, JPA, Spring Boot, Angular, Playwright), as recorded in
`docs/architecture/stack.md`. The UI layer of UC-020 is implemented: the routed page
`frontend/src/app/pages/register-guest/register-guest.ts` with its template, and `GuestService` with its models in
`frontend/src/app/services/`. The backend and its tests already exist and are not part of this task.

The API layer's contract: `POST /api/guests` with `GuestRequest { firstName, lastName, email }` returns `200` with
`GuestDto { id, firstName, lastName, email }`; a duplicate email (BR-001) returns `409` as RFC 9457 Problem
Details whose `detail` is "This email address is already registered.", and invalid input returns `400`.

The use case is `docs/use_cases/UC-020-register-guest.md`.

## Output Specification

Write the UI-layer tests of UC-020 with Vitest: the main scenario, A1, and A2 as the page shows them. Keep
`docs/architecture/stack.md` up to date as the UI test skill requires. Do not change production code. If you cannot run
the tests in this environment, say so instead of claiming they pass, and report any test you expect to fail because
the code disagrees with the specification.
