<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# UC001RegisterGuestApiTest.java

The source file `UC001RegisterGuestApiTest.java`, wrapped in Markdown so that every skill host installs it.
Use the content of the code block below; a copy written to disk takes the name `UC001RegisterGuestApiTest.java`.

```java
package com.example.hotel.api.guest;

import com.example.hotel.usecase.UseCase;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
// Spring Boot 3: org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.web.servlet.assertj.MockMvcTester;
import org.springframework.test.web.servlet.assertj.MvcTestResult;
// Testcontainers 1 (Spring Boot 3): org.testcontainers.containers.PostgreSQLContainer, used as PostgreSQLContainer<?>
import org.testcontainers.postgresql.PostgreSQLContainer;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * API tests for UC-001 "Register Guest".
 *
 * Template for /spring-rest-test, Convention B (MockMvcTester, no live server), Spring Boot 4 and Testcontainers 2:
 * - Class name UC<id><PascalCaseUseCaseName>ApiTest, every test method annotated @UseCase
 * - Full stack: controller → service → persistence → Testcontainers database, nothing mocked
 * - Asserts what the client relies on: status, Location, JSON field names and formats, the Problem Details body
 *   of each rejection — and, as the integration layer, every business rule with its allowed and its rejected
 *   request at the boundary the rule names
 * - Fixtures come from the Flyway test migration src/test/resources/db/migration/R__uc001_register_guest.sql:
 *     insert into guest (id, version, first_name, last_name, email, birth_date, registered_at)
 *     values (nextval('guest_seq'), 0, 'Alice', 'Example', 'alice@example.com', date '1985-01-01',
 *             timestamp '2026-01-15 09:00:00');
 * - @AfterEach removes only the rows the test created through the API
 */
@SpringBootTest
@AutoConfigureMockMvc
@Import(UC001RegisterGuestApiTest.Config.class)
class UC001RegisterGuestApiTest {

    @TestConfiguration(proxyBeanMethods = false)
    static class Config {

        @Bean
        @ServiceConnection
        PostgreSQLContainer postgres() {
            return new PostgreSQLContainer("postgres:17-alpine");
        }
    }

    @Autowired
    private MockMvcTester mvc;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @AfterEach
    void removeCreatedGuests() {
        jdbcTemplate.update("delete from guest where email like '%@api-test.example.com'");
    }

    @Test
    @UseCase(id = "UC-001")
    void registers_a_guest_and_returns_its_location() {
        MvcTestResult result = register("anna@api-test.example.com", "1990-05-04");

        assertThat(result).hasStatus(201);
        assertThat(result.getResponse().getHeader("Location")).matches(".*/api/guests/\\d+");
        assertThat(result).bodyJson().extractingPath("$.email").asString().isEqualTo("anna@api-test.example.com");
        assertThat(result).bodyJson().extractingPath("$.birthDate").asString().isEqualTo("1990-05-04");
    }

    @Test
    @UseCase(id = "UC-001", scenario = "A1: Email Already Registered", businessRules = {"BR-002"})
    void returns_a_problem_detail_when_the_email_is_already_registered() {
        // alice@example.com is registered by the test data migration
        MvcTestResult result = register("alice@example.com", "1970-01-01");

        assertThat(result).hasStatus(409);
        assertThat(result).hasContentType(MediaType.APPLICATION_PROBLEM_JSON);
        assertThat(result).bodyJson().extractingPath("$.detail").asString()
                .isEqualTo("The email address alice@example.com is already registered.");
        assertThat(result).bodyJson().extractingPath("$.type").asString()
                .isEqualTo("urn:problem:EmailAlreadyRegisteredException");
    }

    @Test
    @UseCase(id = "UC-001", businessRules = {"BR-003"})
    void registers_a_guest_who_turns_eighteen_on_the_day_of_arrival() {
        // arrival 2026-03-10, born exactly eighteen years before
        MvcTestResult result = register("cara@api-test.example.com", "2008-03-10");

        assertThat(result).hasStatus(201);
    }

    @Test
    @UseCase(id = "UC-001", scenario = "A2: Guest Too Young", businessRules = {"BR-003"})
    void returns_a_problem_detail_when_the_guest_is_under_eighteen_on_the_day_of_arrival() {
        // one day younger than the boundary
        MvcTestResult result = register("dan@api-test.example.com", "2008-03-11");

        assertThat(result).hasStatus(409);
        assertThat(result).hasContentType(MediaType.APPLICATION_PROBLEM_JSON);
        assertThat(result).bodyJson().extractingPath("$.detail").asString()
                .isEqualTo("Guests must be at least 18 years old on the day of arrival.");
        assertThat(result).bodyJson().extractingPath("$.type").asString()
                .isEqualTo("urn:problem:GuestTooYoungException");
    }

    @Test
    @UseCase(id = "UC-001", scenario = "A3: Invalid Input")
    void returns_field_errors_for_invalid_input() {
        MvcTestResult result = mvc.post().uri("/api/guests")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {"firstName": "", "lastName": "Muster", "email": "not-an-email",
                         "birthDate": "1990-05-04", "arrivalDate": "2026-03-10"}
                        """)
                .exchange();

        assertThat(result).hasStatus(400);
        assertThat(result).hasContentType(MediaType.APPLICATION_PROBLEM_JSON);
        assertThat(result).bodyJson().extractingPath("$.errors[*].field").asArray()
                .containsExactlyInAnyOrder("firstName", "email");
    }

    private MvcTestResult register(String email, String birthDate) {
        return mvc.post().uri("/api/guests")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {"firstName": "Anna", "lastName": "Muster", "email": "%s",
                         "birthDate": "%s", "arrivalDate": "2026-03-10"}
                        """.formatted(email, birthDate))
                .exchange();
    }
}
```
