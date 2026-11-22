# Build the Migration Layer of "Register Guest" (UC-003)

## Problem Description

A hotel team combines layer plugins: Flyway for the schema, jOOQ for persistence, and Spring Boot for services and a
REST API. `docs/architecture/stack.md` records the layers and where each one lives. The project is a Maven reactor with a
domain, application, persistence, API, and app module. The rooms already have their tables; guests do not have one
yet.

The use case is specified at `docs/use_cases/UC-003-register-guest.md`; the entity model is at
`docs/entity_model.md`.

## Output Specification

Run the migration layer skill for UC-003 directly (as `/flyway-schema UC-003` would): create whatever migration the
use case needs, keep the Markers table of `docs/architecture/stack.md` current, and end with the layer's Handover block and
the hand-off line to the next layer.

Do not write Java code, repositories, or tests.

This session's conversation is not kept. Append every message you write to the user, word for word and in order, to
`session-log.md` in the root of the working directory; that log is not part of the project.
