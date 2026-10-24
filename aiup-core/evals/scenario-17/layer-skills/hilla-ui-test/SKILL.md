---
name: hilla-ui-test
description: >
  Writes the UI layer tests of a use case (UC-XXX) for Hilla React views with Vitest in browser mode and React
  Testing Library, with the generated endpoint clients mocked by vi.spyOn — no server, no database. Covers what the
  actor sees: rendering, form input and useForm validation, the calls the view makes to the endpoint, and the
  messages the specification states for every outcome and alternative flow. Each suite is
  UC-XXX-<slug>.test.tsx with describe('UC-XXX: <name>'). Use when the user asks to "test the Hilla view of
  UC-001", "write Vitest tests for a Hilla view", "test a React view for Vaadin", "test the UI layer", or mentions
  Hilla testing, endpoint mocking, or TSX view tests in a project that combines layer plugins. Normally run by
  /use-case-test after the service tests; it can be run directly. Also writes a Java test of the endpoint's access
  annotation and EndpointException messages. The business rules are tested by the integration layer's test skill.
---

<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# Hilla UI Test

## Instructions

Write the UI layer tests of the use case $ARGUMENTS for the Hilla view with Vitest in browser mode and React Testing
Library, the generated endpoint clients mocked with `vi.spyOn` — no server, no database. Each suite is
`src/main/frontend/tests/UC-XXX-<slug>.test.tsx` with `describe('UC-XXX: <name>')`.

## Run Directly or from /use-case-test

Run from `/use-case-test`, this skill follows that skill's sections "If Tests for This Use Case Already Exist",
"When a Test Fails", and "Which Layer Tests What"; it does not repeat them. The specification is the oracle: take
every expected value from it, never from what the code returns.

## What to Test

What the actor sees: rendering, form validation, the call the view makes, and the message the specification states
for each outcome and alternative flow. The business rules are tested by the integration layer's test skill. Also
write one Java test of the endpoint, `UC<id><Name>EndpointTest`: its access annotation and the `EndpointException`
message of each alternative flow.

## Markers

Keep this skill's rows in the Markers table of `docs/architecture/stack.md` exactly as
[references/markers.md](references/markers.md) lists them: add them when they are missing, correct them when they
differ. Touch no other row.
