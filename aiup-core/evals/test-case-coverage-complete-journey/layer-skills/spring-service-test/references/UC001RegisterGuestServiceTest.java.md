<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# UC001RegisterGuestServiceTest.java

The source file `UC001RegisterGuestServiceTest.java`, wrapped in Markdown so that every skill host installs it.
Use the content of the code block below; a copy written to disk takes the name `UC001RegisterGuestServiceTest.java`.

```java
package com.example.hotel.guest;

import com.example.hotel.usecase.UseCase;
import jakarta.validation.ConstraintViolationException;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.Primary;
import org.springframework.jdbc.core.JdbcTemplate;
// Testcontainers 1 (Spring Boot 3): org.testcontainers.containers.PostgreSQLContainer, used as PostgreSQLContainer<?>
import org.testcontainers.postgresql.PostgreSQLContainer;

import java.time.Clock;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/**
 * Service tests for UC-001 "Register Guest".
 *
 * Template for /spring-service-test with the real persistence layer:
 * - Class name UC<id><PascalCaseUseCaseName>ServiceTest, every test method annotated @UseCase
 * - The service is called directly as a Spring bean — no HTTP, no UI
 * - Real database from Testcontainers 2 (Spring Boot 4), schema from the project's Flyway migrations
 * - Fixtures come from the Flyway test migration src/test/resources/db/migration/R__uc001_register_guest.sql:
 *     insert into guest (id, version, first_name, last_name, email, birth_date, registered_at)
 *     values (nextval('guest_seq'), 0, 'Alice', 'Example', 'alice@example.com', date '1985-01-01',
 *             timestamp '2026-01-15 09:00:00');
 *   A test creates through the service only the guest whose registration it tests
 * - A fixed Clock, so rules that depend on "today" have one expected value
 * - Each business rule: one allowed and one rejected case; the rejected case asserts the
 *   exception type and the full message the specification states
 * - Not @Transactional: the service's own transaction boundary runs as in production;
 *   @AfterEach removes only the rows the test created
 */
@SpringBootTest
@Import(UC001RegisterGuestServiceTest.Config.class)
class UC001RegisterGuestServiceTest {

    @TestConfiguration(proxyBeanMethods = false)
    static class Config {

        @Bean
        @ServiceConnection
        PostgreSQLContainer postgres() {
            return new PostgreSQLContainer("postgres:17-alpine");
        }

        @Bean
        @Primary
        Clock fixedClock() {
            return Clock.fixed(Instant.parse("2026-03-01T10:00:00Z"), ZoneOffset.UTC);
        }
    }

    private static final LocalDate ARRIVAL = LocalDate.of(2026, 3, 10);

    @Autowired
    private GuestService guestService;

    @Autowired
    private GuestRepository guestRepository; // read-only: checks what the service stored

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private final List<Long> createdIds = new ArrayList<>();

    @AfterEach
    void removeCreatedGuests() {
        createdIds.forEach(id -> jdbcTemplate.update("delete from guest where id = ?", id));
        createdIds.clear();
    }

    @Test
    @UseCase(id = "UC-001")
    void registers_a_guest() {
        Guest guest = register("anna@example.com", LocalDate.of(1990, 5, 4));

        assertThat(guest.id()).isNotNull();
        assertThat(guestService.list(0, 10, new GuestFilter("Muster")))
                .extracting(GuestListItem::email).contains("anna@example.com");
    }

    @Test
    @UseCase(id = "UC-001", scenario = "A1: Email Already Registered", businessRules = {"BR-002"})
    void rejects_an_email_that_is_already_registered() {
        // alice@example.com is registered by the test data migration
        assertThatThrownBy(() -> register("alice@example.com", LocalDate.of(1970, 1, 1)))
                .isInstanceOf(EmailAlreadyRegisteredException.class)
                .hasMessage("The email address alice@example.com is already registered.");
    }

    @Test
    @UseCase(id = "UC-001", businessRules = {"BR-003"})
    void accepts_a_guest_who_turns_eighteen_on_the_day_of_arrival() {
        Guest guest = register("cara@example.com", ARRIVAL.minusYears(18));

        assertThat(guestRepository.findById(guest.id()))
                .hasValueSatisfying(stored -> assertThat(stored.birthDate()).isEqualTo(LocalDate.of(2008, 3, 10)));
    }

    @Test
    @UseCase(id = "UC-001", scenario = "A2: Guest Too Young", businessRules = {"BR-003"})
    void rejects_a_guest_who_is_under_eighteen_on_the_day_of_arrival() {
        assertThatThrownBy(() -> register("dan@example.com", ARRIVAL.minusYears(18).plusDays(1)))
                .isInstanceOf(GuestTooYoungException.class)
                .hasMessage("Guests must be at least 18 years old on the day of arrival.");
    }

    @Test
    @UseCase(id = "UC-001", scenario = "A3: Invalid Input")
    void rejects_a_missing_email() {
        assertThatThrownBy(() -> guestService.register(
                new RegisterGuest("Eva", "Meier", null, LocalDate.of(1990, 1, 1), ARRIVAL)))
                .isInstanceOf(ConstraintViolationException.class);
    }

    private Guest register(String email, LocalDate birthDate) {
        Guest guest = guestService.register(new RegisterGuest("Anna", "Muster", email, birthDate, ARRIVAL));
        createdIds.add(guest.id());
        return guest;
    }
}
```
