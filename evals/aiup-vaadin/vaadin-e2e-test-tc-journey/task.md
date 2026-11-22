# Automate the Test Case TC-003 in the Browser

## Problem Description

A hotel application combines layer plugins (Flyway, jOOQ, Spring Boot services, Vaadin Flow 25.1 UI) and tests
its journeys end to end with Playwright and Drama Finder; the layers are recorded in `docs/architecture/stack.md`. The
test case `docs/test_cases/TC-003-guest-registration-duplicate.md` chains UC-020 Register Guest and UC-021 Find
Guest (`docs/use_cases/`). Both use cases are implemented in the view `com.example.hotel.guest.ui.GuestsView`, and
the Flyway test data in `src/test/resources/db/migration/V900__guest_test_data.sql` holds three guests. The
project has the Drama Finder dependency but no end-to-end test yet.

## Output Specification

Write the end-to-end test for TC-003, as `/test-case-implement TC-003` would delegate it, under
`src/test/java/com/example/hotel/e2e/`. Update the Markers table in `docs/architecture/stack.md` for this layer. Do not
change production code and do not run anything; state which assertions you expect to fail against the current
code and why.

This session's conversation is not kept. Append every message you write to the user, word for word and in order, to
`session-log.md` in the root of the working directory; that log is not part of the project.
