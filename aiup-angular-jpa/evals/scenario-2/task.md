# Write Backend Tests for "Register Guest" (UC-020)

## Problem Description

A hotel booking system's backend is a single flat Maven module (`backend/`, package
`com.example.hotel`) — there is no hexagonal multi-module split in this project. The team already has
one integration test in place for a different use case, `RoomTypeIntegrationTest`, which extends an
`IntegrationTestBase` (`@Testcontainers` + `@SpringBootTest(webEnvironment = RANDOM_PORT)` + a real
Postgres container + Flyway auto-migrate) and drives the API with **RestAssured**, asserting with
Hamcrest matchers. There is no MockMvc anywhere in this project's test sources.

The engineering team has finished implementing the backend for UC-020 "Register Guest" (spec at
`docs/use-cases/UC-020-register-guest.md`). The implementation already exists under
`backend/src/main/java/com/example/hotel/guest/`:

- `Guest.java` — the JPA entity
- `GuestRepository.java` — Spring Data JPA repository with `existsByEmail(String email)`
- `GuestDto.java` — the response DTO
- `GuestService.java` — enforces BR-020, throwing `IllegalArgumentException` when the email is already
  registered
- `GuestController.java` — exposes `POST /api/guests`, returning 200 with the `GuestDto` on success or
  400 with an `ApiErrorResponse` message when registration fails

## Output Specification

Produce a Spring Boot integration test class for UC-020 at
`backend/src/test/java/com/example/hotel/guest/<ClassName>.java`, following the naming convention for
this type of test and matching the project's **existing** test convention exactly (extend
`IntegrationTestBase`, drive the API with RestAssured, assert with Hamcrest/AssertJ) — do **not**
introduce MockMvc, even though it's a common alternative, since this project has already established a
different convention.

The test class should cover:

- The main scenario: registering a guest with valid data returns 200 and the created guest.
- The alternative flow (A1) where the email is already registered: returns 400 with an error message.
- The business rule (BR-020) that guest emails are unique.

Reuse the `UseCase` annotation already present at `com.example.hotel.usecase.UseCase` — do not create a
new one. Do **not** run the tests — just produce the source file.
