<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# UC001ManagePersonsTest.java

The source file `UC001ManagePersonsTest.java`, wrapped in Markdown so that every skill host installs it.
Use the content of the code block below; a copy written to disk takes the name `UC001ManagePersonsTest.java`.

```java
package com.example.app.views;

import java.util.stream.IntStream;

import com.example.app.person.Person;
import com.example.app.usecase.UseCase;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.confirmdialog.ConfirmDialog;
import com.vaadin.flow.component.grid.Grid;
import com.vaadin.flow.component.notification.Notification;
import com.vaadin.flow.component.textfield.TextField;
import com.vaadin.browserless.SpringBrowserlessTest;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.TestPropertySource;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Use case test for UC-001 "Manage Persons". The view gets its data from the service layer
 * (PersonService returning Person records); the test drives the view only and seeds data through
 * the Flyway test migrations, never through the service. Labels and messages come from the
 * vaadin-flow-ui Handover and the specification.
 */
@SpringBootTest
@TestPropertySource(properties = "spring.flyway.locations=classpath:db/migration,classpath:db/testdata")
@WithMockUser(roles = "ADMIN")   // the actor's role, as @RolesAllowed("ADMIN") on the view
class UC001ManagePersonsTest extends SpringBrowserlessTest {

    // The one person these tests create; the test data holds no person with this email
    private static final String NEW_EMAIL = "carol.miller@example.com";

    @Autowired
    private JdbcClient jdbcClient;

    @AfterEach
    void removeCreatedPerson() {
        // Idempotent and targeted: a test may have failed before or after creating the person
        jdbcClient.sql("delete from person where email = ?").param(NEW_EMAIL).update();
    }

    @Test
    @UseCase(id = "UC-001")
    void grid_lists_the_persons_of_the_test_data() {
        navigate(ManagePersonsView.class);

        // Expected values come from the Flyway test data (sorted by first name), never from a
        // run of the code. Assert rows, not the total: other use cases' test data may share the table.
        Grid<Person> grid = $(Grid.class).id("person-grid");
        assertThat(test(grid).getRow(0).firstName()).isEqualTo("Eula");
        assertThat(test(grid).getCellText(0, 1)).isEqualTo("Lane");
    }

    @Test
    @UseCase(id = "UC-001")
    void selecting_a_row_fills_the_form() {
        navigate(ManagePersonsView.class);

        Grid<Person> grid = $(Grid.class).id("person-grid");
        grid.select(test(grid).getRow(0));

        // First row of the test data — not read back from the grid, which would only compare
        // the view with itself
        assertThat($(TextField.class).withCaption("First Name").single().getValue()).isEqualTo("Eula");
        assertThat($(TextField.class).withCaption("Last Name").single().getValue()).isEqualTo("Lane");
    }

    @Test
    @UseCase(id = "UC-001")
    void saving_a_new_person_shows_the_message_and_lists_the_person() {
        navigate(ManagePersonsView.class);

        createPerson("Carol", "Miller", NEW_EMAIL);

        // Main success scenario step 5: the exact message the specification states
        Notification notification = $(Notification.class).single();
        assertThat(test(notification).getText()).isEqualTo("Person saved");
        // Postcondition: the new person is persisted — read back from the database, not only from the
        // grid — and listed
        assertThat(jdbcClient.sql("select first_name from person where email = ?")
                .param(NEW_EMAIL).query(String.class).list()).containsExactly("Carol");
        assertThat(rowOf($(Grid.class).id("person-grid"), NEW_EMAIL)).isNotNegative();
    }

    @Test
    @UseCase(id = "UC-001")
    void required_first_name_shows_validation_error() {
        navigate(ManagePersonsView.class);

        TextField firstName = $(TextField.class).withCaption("First Name").single();
        test($(TextField.class).withCaption("Last Name").single()).setValue("Miller");
        test($(TextField.class).withCaption("Email").single()).setValue(NEW_EMAIL);
        test($(Button.class).withText("Save").single()).click();

        // Entity model: the first name is required — message as the specification words it
        assertThat(firstName.isInvalid()).isTrue();
        assertThat(firstName.getErrorMessage()).isEqualTo("Field is required");
        assertThat(rowOf($(Grid.class).id("person-grid"), NEW_EMAIL)).isNegative();
    }

    @Test
    @UseCase(id = "UC-001", scenario = "A1: Email Already Registered", businessRules = {"BR-001"})
    void saving_with_a_registered_email_is_rejected() {
        navigate(ManagePersonsView.class);

        // BR-001: the email is unique — eula.lane@example.com is registered by the test data
        createPerson("Carol", "Miller", "eula.lane@example.com");

        Notification notification = $(Notification.class).single();
        assertThat(test(notification).getText()).isEqualTo("Email already registered");
    }

    @Test
    @UseCase(id = "UC-001", scenario = "A2: Delete Confirmation")
    void delete_removes_the_person_after_confirmation() {
        navigate(ManagePersonsView.class);
        // Delete a person this test created, never a row of the shared test data
        createPerson("Carol", "Miller", NEW_EMAIL);

        Grid<Person> grid = $(Grid.class).id("person-grid");
        grid.select(test(grid).getRow(rowOf(grid, NEW_EMAIL)));
        test($(Button.class).withText("Delete").single()).click();

        ConfirmDialog dialog = $(ConfirmDialog.class).single();
        test(dialog).confirm();

        // Postcondition of A2: the person is removed from the database and the grid
        assertThat($(ConfirmDialog.class).exists()).isFalse();
        assertThat(jdbcClient.sql("select count(*) from person where email = ?")
                .param(NEW_EMAIL).query(Long.class).single()).isZero();
        assertThat(rowOf(grid, NEW_EMAIL)).isNegative();
    }

    private void createPerson(String firstName, String lastName, String email) {
        test($(TextField.class).withCaption("First Name").single()).setValue(firstName);
        test($(TextField.class).withCaption("Last Name").single()).setValue(lastName);
        test($(TextField.class).withCaption("Email").single()).setValue(email);
        test($(Button.class).withText("Save").single()).click();
    }

    /** Index of the row with this email, or -1 — reads every row, so it works with lazy data providers. */
    private int rowOf(Grid<Person> grid, String email) {
        return IntStream.range(0, test(grid).size())
                .filter(i -> email.equals(test(grid).getRow(i).email()))
                .findFirst()
                .orElse(-1);
    }
}
```
