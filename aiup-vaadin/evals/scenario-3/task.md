# Write the UI Layer Tests for "Register Guest" (UC-020) in the Hilla View

## Problem Description

A hotel application combines layer plugins (Flyway, jOOQ, Spring Boot services, Hilla UI on Vaadin 25.3); the
layers are recorded in `docs/architecture/stack.md`. UC-020 is specified at `docs/use_cases/UC-020-register-guest.md` and
implemented: the endpoint `com.example.hotel.guest.GuestEndpoint` delegates to `GuestService`, and the view is
`src/main/frontend/views/guests.tsx`. The generated client is `Frontend/generated/endpoints` (`GuestEndpoint`
with `list()` and `register(registration)`); the generated types live under
`Frontend/generated/com/example/hotel/guest/`. The frontend does not run Vitest yet. The service layer is tested
by `src/test/java/com/example/hotel/guest/UC020RegisterGuestServiceTest.java`, which uses the `UseCase` annotation
in `src/test/java/com/example/hotel/usecase/`.

## Output Specification

Write the UI layer tests of UC-020, as `/use-case-test` would delegate them to the UI test skill, including whatever
one-time test setup the project needs. Cover the main success scenario and A1. Update the Markers table in
`docs/architecture/stack.md` for this layer. Do not change production code and do not run anything; state which
tests you expect to fail against the current code and why.
