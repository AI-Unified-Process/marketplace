# Write the service tests of "Register Guest" (UC-001)

## Problem Description

A hotel team builds a Spring Boot 4.0 application with a Hilla UI and jOOQ in one flat Maven module (package
`com.example.hotel`). `docs/architecture/development.md` records the layers and the test commands. The service layer of UC-001
is implemented in `src/main/java/com/example/hotel/guest/GuestService.java`. No test for UC-001 exists
yet.

The specification is at `docs/use_cases/UC-001-register-guest.md`.

## Output Specification

Run `/spring-service-test UC-001`: write the service layer tests of UC-001 only. There is no Docker in this
environment, so you cannot run them; say so in the report instead of claiming they pass.
