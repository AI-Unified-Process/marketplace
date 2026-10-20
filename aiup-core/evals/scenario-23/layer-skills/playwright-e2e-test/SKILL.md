---
name: playwright-e2e-test
description: >
  Writes end-to-end browser tests in TypeScript with @playwright/test for any web UI that is not Vaadin (Angular
  today, other client-side frameworks alike): a use case test (UC-XXX) with one test per scenario, or a test case
  journey (TC-XXX) that walks the whole Flow table across views with one test.step per row. Locates elements by
  role, label, and text against the running application and cleans up only the data the test created. Use when the
  user asks to "write Playwright tests", "create e2e tests", "test in the browser", "automate a test case", "test a
  user journey", "automate TC-001", or mentions end-to-end, browser, or UI integration tests. Normally run by
  /use-case-test (or /test-case-implement for a TC-*) as the E2E layer of a project whose docs/architecture/stack.md names Playwright; it can also be run directly.
  For a Vaadin UI use /vaadin-e2e-test.
---

<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# Playwright E2E Test

## Instructions

Write Playwright browser tests in TypeScript against the running application: `UC-XXX-<slug>.spec.ts` for a use case,
`TC-XXX-<slug>.spec.ts` for a test case journey with one `test.step('Step <n>: …')` per Flow row.

## Run Directly or from /use-case-test

Run from `/use-case-test`, this skill follows that skill's sections "If Tests for This Use Case Already Exist",
"When a Test Fails", and "Which Layer Tests What"; it does not repeat them. The specification is the oracle: take
every expected value from it, never from what the code returns.

## Markers

Keep this skill's rows in the Markers table of `docs/architecture/stack.md` exactly as
[references/markers.md](references/markers.md) lists them: add them when they are missing, correct them when they
differ. Touch no other row.
