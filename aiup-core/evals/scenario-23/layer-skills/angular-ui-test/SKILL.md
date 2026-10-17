---
name: angular-ui-test
description: >
  Writes the UI-layer tests of a use case (UC-XXX) for an Angular client with Vitest and Angular's own testing
  idioms: TestBed component tests for the routed page, HttpTestingController for the API boundary, DI overrides for
  non-HTTP services, and plain service tests — in UC-XXX-<slug>.spec.ts files with a describe('UC-XXX: …') block.
  Use when the user asks to "write frontend tests", "test the Angular component", "write a Vitest test", "unit test
  an Angular page", "test the UI of UC-001", or mentions TestBed, ComponentFixture, or HttpTestingController.
  Normally run by /use-case-test as the UI test layer of a project whose docs/architecture/development.md names Angular; it can also
  be run directly. Browser tests against the running application are /playwright-e2e-test.
---

<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# Angular UI Test

## Instructions

Write the UI layer tests of the use case $ARGUMENTS for the Angular page and its HTTP service with Vitest and the
Angular testing utilities, the HTTP backend mocked with `HttpTestingController` — no server, no database. Each spec
is `UC-XXX-<slug>.spec.ts` next to the page or service, with `describe('UC-XXX: <name>')`.

## Run Directly or from /use-case-test

Run from `/use-case-test`, this skill follows that skill's sections "If Tests for This Use Case Already Exist",
"When a Test Fails", and "Which Layer Tests What"; it does not repeat them. The specification is the oracle: take
every expected value from it, never from what the code returns.

## What to Test

What the actor sees and what the page sends: rendering, form validation, the request the HTTP service makes, and
the message the specification states for each outcome, including the Problem Details of a rejection. The business
rules are tested by the API layer, the integration layer of an Angular project.

## Markers

Keep this skill's rows in the Markers table of `docs/architecture/development.md` exactly as
[references/markers.md](references/markers.md) lists them: add them when they are missing, correct them when they
differ. Touch no other row.
