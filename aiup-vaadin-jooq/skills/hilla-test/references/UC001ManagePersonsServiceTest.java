package com.example.app.person;

import com.example.app.usecase.UseCase;
import com.vaadin.hilla.exception.EndpointException;
import org.jooq.DSLContext;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.ArrayList;
import java.util.List;

import static com.example.app.jooq.Tables.PERSON;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/**
 * Backend tests for UC-001 "Manage Persons".
 *
 * Template for /hilla-test backend suites:
 * - Class name UC<id><PascalCaseUseCaseName>ServiceTest
 * - The @BrowserCallable service is called directly as a Spring bean — no HTTP layer
 * - Every test method carries @UseCase for spec traceability
 * - Seed data comes from Flyway test migrations (src/test/resources/db/migration);
 *   @AfterEach removes only rows the tests created
 * - No Mockito, no @Transactional
 */
@SpringBootTest
class UC001ManagePersonsServiceTest {

    @Autowired
    private PersonService personService;

    @Autowired
    private DSLContext ctx;

    private final List<Long> createdIds = new ArrayList<>();

    @AfterEach
    void removeTestCreatedData() {
        if (!createdIds.isEmpty()) {
            ctx.deleteFrom(PERSON).where(PERSON.ID.in(createdIds)).execute();
            createdIds.clear();
        }
    }

    @Test
    @UseCase(id = "UC-001")
    void lists_persons_from_seed_data() {
        List<PersonDto> persons = personService.list();

        // alice and bob are seeded by V001__test_data.sql
        assertThat(persons)
                .extracting(PersonDto::email)
                .contains("alice@example.com", "bob@example.com");
    }

    @Test
    @UseCase(id = "UC-001")
    void saves_a_new_person_and_returns_it_with_an_id() {
        PersonDto saved = personService.save(
                new PersonDto(null, "Carol", "Miller", "carol@example.com"));
        createdIds.add(saved.id());

        assertThat(saved.id()).isNotNull();
        assertThat(personService.list())
                .extracting(PersonDto::email)
                .contains("carol@example.com");
    }

    @Test
    @UseCase(id = "UC-001", scenario = "A1: Email Already Exists", businessRules = {"BR-002"})
    void save_rejects_duplicate_email() {
        // alice@example.com already exists in the seed data
        assertThatThrownBy(() -> personService.save(
                new PersonDto(null, "Alice", "Clone", "alice@example.com")))
                .isInstanceOf(EndpointException.class)
                .hasMessageContaining("already registered");
    }
}
