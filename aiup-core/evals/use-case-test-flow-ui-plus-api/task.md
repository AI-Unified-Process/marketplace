# Tests for Register for Workshop

## Problem/Feature Description

A training company runs its workshop registration as one Spring Boot application. Organizers and participants work
in a Vaadin Flow web application; a partner portal calls the same system over a JSON REST API. The project follows
the AI Unified Process and builds its code with layer plugins. The specifications are under `docs/`.

The use case UC-002 Register for Workshop (`docs/use_cases/UC-002-register-for-workshop.md`) is implemented in the
views and in the REST API, but it has no tests yet. The team wants them written now. There are no API tests in the project yet; for
them the team has chosen MockMvcTester against the full stack with a Testcontainers database.

## Output Specification

Write the tests for UC-002 and finish with a short report of what was written and what comes next. There is no
database, Docker, or Maven repository in this environment, so no test suite can be run; say so rather than claiming
that a suite passed.

This session's conversation is not kept. Append every message you write to the user, word for word and in order, to
`session-log.md` in the root of the working directory; that log is not part of the project.
