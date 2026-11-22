# Build the Hilla View for "Register Guest" (UC-020)

## Problem Description

A hotel application combines layer plugins: Flyway, jOOQ, Spring Boot services, and a Hilla (React) UI on Vaadin
25.3. The layers are recorded in `docs/architecture/stack.md`. The use case is specified at
`docs/use_cases/UC-020-register-guest.md`, and the service layer for it is already finished:

```text
Handover from spring-service (UC-020)
- GuestService.list(int offset, int limit): List<Guest>; count(): int  — src/main/java/com/example/hotel/guest/GuestService.java
- GuestService.register(GuestRegistration): Guest  — @Valid input; BR-001 and BR-002 enforced
  - throws EmailAlreadyRegisteredException ("Email already registered") for A1
  - throws IllegalArgumentException ("The guest must be at least 18 years old") for BR-002
- Guest(long id, String firstName, String lastName, String email, LocalDate dateOfBirth) — record
- GuestRegistration(firstName, lastName, email, dateOfBirth) — record with Jakarta Bean Validation annotations
```

The frontend has a layout at `src/main/frontend/views/@layout.tsx` that builds the menu from the views'
`ViewConfig`. No endpoint or view exists for UC-020 yet.

## Output Specification

Implement only the UI layer of UC-020 with Hilla, as `/use-case-implement` would delegate it to the UI layer skill:
the browser-callable endpoint in `src/main/java/com/example/hotel/guest/` and the React view under
`src/main/frontend/views/`. Update the Markers table in `docs/architecture/stack.md` for this layer. Do not write
tests, do not change the service or repository, and do not build or run anything. Finish with the Handover block
of the UI layer.

This session's conversation is not kept. Append every message you write to the user, word for word and in order, to
`session-log.md` in the root of the working directory; that log is not part of the project.
