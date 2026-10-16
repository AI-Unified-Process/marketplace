# Implement the REST API layer of "Register Guest" (UC-001)

## Problem Description

A hotel team builds a Spring Boot 4.0 REST service with jOOQ in one flat Maven module (package
`com.example.hotel`). `docs/architecture/development.md` records the layers and the API contract. The persistence and service
layers of UC-001 are implemented; the service handover was:

```text
Handover from spring-service (UC-001)
- GuestService.register(RegisterGuest): Guest — src/main/java/com/example/hotel/guest/GuestService.java
  steps 3–5; throws EmailAlreadyRegisteredException (A1, BR-002),
  GuestTooYoungException (A2, BR-003), ConstraintViolationException (invalid input, BR-001)
- RegisterGuest(String firstName, String lastName, String email, LocalDate birthDate, LocalDate arrivalDate)
- Exception kinds: BusinessRuleException (rule violated)
```

The project has no controller and no exception handler yet.

## Output Specification

Run `/spring-rest UC-001`: implement the API layer only. Do not change the service, the repository, or write tests.
End with the Handover block for the next layer.
