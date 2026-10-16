---
name: vaadin-e2e-test
description: >
  Writes the end-to-end tests of a Vaadin application (Flow or Hilla) with Playwright for Java and the Drama
  Finder library's type-safe, accessibility-first element wrappers, against the running application. Two kinds:
  a use case test (UC-XXX) — one class UC<id><Name>IT with @Nested groups per alternative flow — and a test case
  journey (TC-XXX) — one class TC<id><Name>IT walking the whole Flow table across views in a single test with a
  // Step <n>: comment per row. Use when the user asks to "write Playwright tests", "write E2E tests for UC-001",
  "automate TC-001", "test the user journey in the browser", "write IT tests", or mentions end-to-end, browser
  tests, Playwright for Vaadin, or Drama Finder in a project that combines layer plugins. Normally run by /use-case-test
  as the last layer, and the only one /test-case-implement TC-XXX runs; it can be run directly.
---

<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# Vaadin E2E Test

## Instructions

Write browser tests against the running application with Playwright for Java and the Drama Finder element wrappers:
`UC<id><Name>IT` for a use case — its main success scenario and the alternative flows an actor sees — or
`TC<id><Name>IT` for a test case journey, with one `// Step <n>: <name>` comment per Flow row and one assertion per
Validation item.

## Run Directly or from /use-case-test

Run from `/use-case-test`, this skill follows that skill's sections "If Tests for This Use Case Already Exist",
"When a Test Fails", and "Which Layer Tests What"; it does not repeat them. The specification is the oracle: take
every expected value from it, never from what the code returns.

## Markers

Keep this skill's rows in the Markers table of `docs/architecture/development.md` exactly as
[references/markers.md](references/markers.md) lists them: add them when they are missing, correct them when they
differ. Touch no other row.
