# Order Lunch, End to End

## Problem/Feature Description

A company canteen takes lunch orders through a Spring Boot service with a JSON REST API; the canteen app that
employees use to order is built by another team in another repository. The kitchen enters the dishes of each day
into the `dish` table with a tool of its own. The project follows the AI Unified Process and builds its code with
layer plugins; the specifications are under `docs/` and the stack file is `docs/architecture/stack.md`.

The use case UC-001 Order Lunch (`docs/use_cases/UC-001-order-lunch.md`) has been approved. The canteen manager
says: "Please build lunch ordering, write the tests for it, and then tell me how well the code and the tests cover
the use case. For the API tests, use MockMvcTester against a Testcontainers database; that is what the team agreed
on."

## Output Specification

Implement UC-001, write its tests, and then check its coverage, one after the other. This runs unattended
overnight: nobody can answer a question, so do not wait for answers. There is no database, Docker, or Maven
repository in this environment, so neither the build nor a test suite can be run; say so rather than claiming that
anything passed.

This session's conversation is not kept. Append every message you write to the user, word for word and in order, to
`session-log.md` in the root of the working directory; that log is not part of the project.
