# Write the Browserless Tests for "Register Guest" (UC-020)

## Problem Description

A hotel application combines layer plugins (Flyway, jOOQ, Spring Boot services, Vaadin Flow 25.1 UI); the layers
are recorded in `docs/architecture/stack.md`. UC-020 is specified at `docs/use_cases/UC-020-register-guest.md` and
implemented: the view `com.example.hotel.guest.ui.GuestsView` calls `GuestService`. The Flyway test data in
`src/test/resources/db/migration/V900__guest_test_data.sql` holds three guests. No tests exist for UC-020 yet, and
the project has no `UseCase` annotation.

## Output Specification

Write the UI layer tests of UC-020 with Vaadin Browserless Testing, as `/use-case-test` would delegate them to the UI
test skill, under `src/test/java/com/example/hotel/guest/ui/`. Cover the main success scenario, A1, and A2.
Update the Markers table in `docs/architecture/stack.md` for this layer. Do not change any production code and do not
run the tests; instead, state in your answer which of your tests you expect to fail against the current code and
why.

This session's conversation is not kept. Append every message you write to the user, word for word and in order, to
`session-log.md` in the root of the working directory; that log is not part of the project.
