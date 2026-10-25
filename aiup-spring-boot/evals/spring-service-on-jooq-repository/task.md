# Implement the service layer of "Register Guest" (UC-001)

## Problem Description

A hotel team builds a Spring Boot 4.0 REST service with jOOQ in one flat Maven module (package
`com.example.hotel`). `docs/architecture/stack.md` records the layers. The persistence layer of UC-001 is already
implemented; its handover was:

```text
Handover from jooq-persistence (UC-001)
- GuestRepository.existsByEmail(String): boolean — src/main/java/com/example/hotel/guest/GuestRepository.java
- GuestRepository.insert(Guest): Guest — returns the guest with its generated id
- Guest(Long id, String firstName, String lastName, String email, LocalDate birthDate, LocalDateTime registeredAt)
- guest.email has a unique constraint (uq_guest_email)
```

The use case is specified at `docs/use_cases/UC-001-register-guest.md`.

## Output Specification

Run `/spring-service UC-001`: implement the service layer only, under
`src/main/java/com/example/hotel/guest/`. Do not write a controller, queries, or tests. End with the Handover block
for the next layer.

This session's conversation is not kept. Append every message you write to the user, word for word and in order, to
`session-log.md` in the root of the working directory; that log is not part of the project.
