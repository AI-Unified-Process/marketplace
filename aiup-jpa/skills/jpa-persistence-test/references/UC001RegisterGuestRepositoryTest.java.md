<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# UC001RegisterGuestRepositoryTest.java

The source file `UC001RegisterGuestRepositoryTest.java`, wrapped in Markdown so that every skill host installs it.
Use the content of the code block below; a copy written to disk takes the name `UC001RegisterGuestRepositoryTest.java`.

```java
package com.example.hotel.postgres.guest;

import com.example.hotel.business.guest.GuestRepository;
import com.example.hotel.domain.guest.Guest;
import com.example.hotel.usecase.UseCase;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
// Spring Boot 3: org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest,
//                org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager, and
//                org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.boot.jdbc.test.autoconfigure.AutoConfigureTestDatabase;
import org.springframework.boot.jpa.test.autoconfigure.TestEntityManager;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.TestPropertySource;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
// Testcontainers 1 (Spring Boot 3): org.testcontainers.containers.PostgreSQLContainer, used as PostgreSQLContainer<?>
import org.testcontainers.postgresql.PostgreSQLContainer;

import java.time.LocalDate;
import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;

// Spring Boot 4 and Testcontainers 2; match the imports of the project's existing tests.
// Hexagonal layout: lives in the persistence-adapter module and tests the adapter through the port. The module has
// no @SpringBootApplication, so its test sources hold a minimal configuration in the adapter's root package:
//   @SpringBootConfiguration @EnableAutoConfiguration class PersistenceTestConfiguration { }
// Flat layout: drop @Import and autowire the Spring Data repository instead.
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Testcontainers
@Import(GuestRepositoryImpl.class)
@TestPropertySource(properties = {
        "spring.flyway.locations=classpath:db/migration,classpath:db/testdata",
        // checks the mapping against the migrated schema; Hibernate's default for a non-embedded database is none
        "spring.jpa.hibernate.ddl-auto=validate"})
class UC001RegisterGuestRepositoryTest {

    // Reuse the project's TestcontainersConfiguration (@Import it) or base class instead when one exists.
    @Container
    @ServiceConnection
    static PostgreSQLContainer postgres = new PostgreSQLContainer("postgres:17-alpine");

    @Autowired
    private GuestRepository guestRepository;

    @Autowired
    private TestEntityManager entityManager;

    // Test data: src/test/resources/db/testdata/R__uc001_register_guest.sql
    //   insert into guest (id, version, first_name, last_name, email, birth_date, registered_at)
    //   values (nextval('guest_seq'), 0, 'Alice', 'Example', 'alice@example.com', date '1985-01-01',
    //           timestamp '2026-01-15 09:00:00');

    // The IgnoreCase query logic of existsByEmail. The rule's allowed and rejected registration belong to the
    // integration layer's tests; test them here only when persistence is the integration layer or nothing runs above.
    // Only then add businessRules = {"BR-002"} to these two tests: otherwise the integration layer's tests own the rule.
    @Test
    @UseCase(id = "UC-001", scenario = "A1: Email Already Registered")
    void email_is_found_regardless_of_case() {
        assertThat(guestRepository.existsByEmail("Alice@Example.com")).isTrue();
    }

    @Test
    @UseCase(id = "UC-001")
    void unknown_email_is_not_found() {
        assertThat(guestRepository.existsByEmail("alice@example.org")).isFalse();
    }

    // The adapter's conversion between the domain record and the entity, in both directions.
    @Test
    @UseCase(id = "UC-001")
    void saved_guest_is_read_back_with_all_fields() {
        Guest saved = guestRepository.save(new Guest(null, 0, "Beat", "Beispiel", "beat@example.com",
                LocalDate.of(1990, 5, 4), LocalDateTime.of(2026, 3, 1, 10, 0)));
        entityManager.clear(); // read from the database, not from the persistence context

        assertThat(guestRepository.findById(saved.id()))
                .hasValueSatisfying(guest -> {
                    assertThat(guest.firstName()).isEqualTo("Beat");
                    assertThat(guest.lastName()).isEqualTo("Beispiel");
                    assertThat(guest.email()).isEqualTo("beat@example.com");
                    assertThat(guest.birthDate()).isEqualTo(LocalDate.of(1990, 5, 4));
                    assertThat(guest.registeredAt()).isEqualTo(LocalDateTime.of(2026, 3, 1, 10, 0));
                });
    }
}
```
