---
name: spring-service-test
description: >
  Writes the service layer tests of a use case (UC-XXX) in a Spring Boot application: every business rule with its
  allowed and its rejected case, every alternative flow the service decides, and the main success scenario, called
  on the @Service directly. Uses @SpringBootTest with the real persistence layer and a Testcontainers database, or
  plain unit tests with an in-memory fake of the outbound port in the business module of a hexagonal project.
  Classes are named UC001<Name>ServiceTest and every method carries @UseCase. Use when the user asks to "test the
  service layer", "test the business rules", "write service tests", "unit test the business logic", or mentions
  @SpringBootTest service tests, Testcontainers, domain exceptions, or business rule tests for a Spring Boot use
  case. Run by /use-case-test as the integration layer of a Hilla stack or a stack without an entry layer, or when
  the service layer is named; below a Vaadin Flow UI or a REST entry layer their tests cover the service. Can
  also be run directly.
---

<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# Spring Service Test

## Instructions

Write the service layer tests of the use case $ARGUMENTS, called on the `@Service` directly, with `@SpringBootTest`,
the real persistence layer, and a Testcontainers database. When the service layer is the integration layer, test
the whole use case here.

## Run Directly or from /use-case-test

Run from `/use-case-test`, this skill follows that skill's sections "If Tests for This Use Case Already Exist",
"When a Test Fails", and "Which Layer Tests What"; it does not repeat them. The specification is the oracle: take
every expected value from it, never from what the code returns.

## Test Class Naming and `@UseCase`

Name the class `UC<id><Name>ServiceTest` in the package of the service. Annotate every test method with
`@UseCase(id = "UC-XXX", scenario = "…", businessRules = {"BR-YYY"})`. Reuse the `UseCase` annotation of the test
sources, or create it in `src/test/java/<root package>/usecase/UseCase.java`.

## What to Test

| Unit of the specification            | Tests                                                                  |
|--------------------------------------|------------------------------------------------------------------------|
| Main success scenario                | the service methods the scenario calls, asserting result and state     |
| Business rule                        | an allowed and a rejected case at the boundary the rule names          |
| Alternative flow the service decides | the domain exception, its type and its full message                    |
| Postcondition                        | the persisted state, read back through the service's own read method  |

Replace the `Clock` bean with a fixed clock; never compute an expected value from `now()`.

## Markers

Keep this skill's rows in the Markers table of `docs/architecture/stack.md` exactly as
[references/markers.md](references/markers.md) lists them: add them when they are missing, correct them when they
differ. Touch no other row.

## Report

List the tests per unit of the specification, the command you ran, and whether it passes; name every unit you
could not reach through the service.
