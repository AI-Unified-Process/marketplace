---
name: vaadin-flow-ui-test
description: >
  Writes the UI layer tests of a use case (UC-XXX) for Vaadin Flow views with Vaadin Browserless Testing — the
  official server-side framework that runs the view inside the JVM without a browser — covering navigation, form
  input and Binder validation, grid contents, dialogs, confirmations, and the notifications the specification
  states. Each test class is UC<id><Name>Test, each method carries @UseCase(id = "UC-XXX", scenario, businessRules).
  Use when the user asks to "write Browserless tests", "test the Vaadin view of UC-001", "write Vaadin UI unit
  tests", "test the UI layer", or mentions SpringBrowserlessTest, browserless-test-spring, or server-side Vaadin
  view tests in a project that combines layer plugins. Normally run by /use-case-test as the integration layer of a Vaadin
  Flow stack: the view runs against the real service and database, so these tests cover the business rules and the
  data access too. It can be run directly. For Hilla views use /hilla-ui-test; for browser tests /vaadin-e2e-test.
---

<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# Vaadin Flow UI Test

## Instructions

Write Browserless tests of the use case $ARGUMENTS for the Vaadin Flow view, extending `SpringBrowserlessTest` with
the real services and a Testcontainers database. Name the class `UC<id><Name>Test` and annotate every method with
`@UseCase`.

## Run Directly or from /use-case-test

Run from `/use-case-test`, this skill follows that skill's sections "If Tests for This Use Case Already Exist",
"When a Test Fails", and "Which Layer Tests What"; it does not repeat them. The specification is the oracle: take
every expected value from it, never from what the code returns.

## What to Test

As the integration layer, test the whole use case through the view: the main success scenario, every alternative
flow with its message, every business rule with its allowed and rejected case, and the postconditions read back
from the persisted state.

## Markers

Keep this skill's rows in the Markers table of `docs/architecture/development.md` exactly as
[references/markers.md](references/markers.md) lists them: add them when they are missing, correct them when they
differ. Touch no other row.
