# Write the API tests of "Register Guest" (UC-001)

## Problem Description

A hotel team builds a Spring Boot 4.0 REST service with jOOQ in one flat Maven module (package
`com.example.hotel`). The API of UC-001 is implemented — `GuestController` (`POST /api/v1/guests`) and the
`ApiExceptionHandler` that renders RFC 9457 Problem Details. The project's existing API test for UC-002 shows its
test convention.

The specification is at `docs/use_cases/UC-001-register-guest.md`; the API contract is in `docs/architecture/stack.md`.

## Output Specification

Run `/spring-rest-test UC-001`: write the API tests of UC-001 only. There is no Docker in this environment, so you
cannot run them; say so in the report instead of claiming they pass.
