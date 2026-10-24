---
name: spring-rest-test
description: >
  Writes the REST API tests of a use case (UC-XXX) in a Spring Boot application: status codes, Location headers, the
  JSON contract (field names, date formats), RFC 9457 Problem Details bodies, and — as the integration layer of a
  REST service or behind an Angular client — every business rule's allowed and rejected request at the boundary,
  through the real service and database. Uses MockMvcTester against the full stack
  or live HTTP with RestTestClient and Testcontainers, detecting and keeping a project's existing convention
  (including MockMvc or RestAssured) and asking before the first API test. Classes are named UC001<Name>ApiTest
  and every method carries @UseCase. Use when the user asks to "test the REST API", "test the controller", "test
  the endpoints", "write API tests", "check the status codes", or mentions MockMvc, MockMvcTester, RestTestClient,
  RestAssured, ProblemDetail tests, or Spring Boot web tests. Normally run by /use-case-test as the integration layer; it
  can also be run directly.
---

<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# Spring REST Test

## Instructions

Write the API layer tests of the use case $ARGUMENTS with MockMvc against the running application context and a
Testcontainers database. Name the class `UC<id><Name>ApiTest` and annotate every method with `@UseCase`.

## Run Directly or from /use-case-test

Run from `/use-case-test`, this skill follows that skill's sections "If Tests for This Use Case Already Exist",
"When a Test Fails", and "Which Layer Tests What"; it does not repeat them. The specification is the oracle: take
every expected value from it, never from what the code returns.

## What to Test

As the integration layer (a REST service, or the API behind a client-side UI), test the whole use case through its
endpoints. As a second entry layer next to a Vaadin Flow or Hilla UI, test only its own contract: the main success
scenario through the endpoint, every alternative flow's status and Problem Details as the caller sees them, and the
mapping of invalid input to 400. The allowed and rejected cases of a business rule stay in the integration layer.

## Markers

Keep this skill's rows in the Markers table of `docs/architecture/stack.md` exactly as
[references/markers.md](references/markers.md) lists them: add them when they are missing, correct them when they
differ. Touch no other row.
