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

import java.time.LocalDate;
import java.util.Set;

import com.example.app.usecase.UseCase;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.combobox.ComboBox;
import com.vaadin.flow.component.confirmdialog.ConfirmDialog;
import com.vaadin.flow.component.datepicker.DatePicker;
import com.vaadin.flow.component.grid.Grid;
import com.vaadin.flow.component.notification.Notification;
import com.vaadin.flow.component.textfield.TextField;
import com.vaadin.browserless.SpringBrowserlessTest;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Use case test for UC-001 "Manage Persons".
 */
@SpringBootTest
class UC001ManagePersonsTest extends SpringBrowserlessTest {

    @Test
    @UseCase(id = "UC-001")
    void view_displays_grid_with_data() {
        navigate(ManagePersonsView.class);

        // Expected values come from the Flyway test data (100 persons, sorted by first name),
        // never from a run of the code.
        Grid<PersonRecord> grid = find(Grid.class).single();
        assertThat(test(grid).size()).isEqualTo(100);
        assertThat(test(grid).getRow(0).getFirstName()).isEqualTo("Eula");
    }

    @Test
    @UseCase(id = "UC-001")
    void grid_row_can_be_selected() {
        navigate(ManagePersonsView.class);

        Grid<PersonRecord> grid = find(Grid.class).single();
        assertThat(test(grid).size()).isEqualTo(100);

        PersonRecord first = test(grid).getRow(0);
        grid.select(first);

        Set<PersonRecord> selected = grid.getSelectedItems();
        assertThat(selected)
                .hasSize(1)
                .first()
                .extracting(PersonRecord::getFirstName)
                .isEqualTo("Eula");
    }

    @Test
    @UseCase(id = "UC-001")
    void saving_a_person_shows_notification() {
        navigate(ManagePersonsView.class);

        test(find(Button.class).withText("Save").single()).click();

        // Main success scenario step 4: the exact message the specification states
        Notification notification = find(Notification.class).single();
        assertThat(test(notification).getText()).isEqualTo("Saved successfully");
    }

    @Test
    @UseCase(id = "UC-001")
    void form_submission_creates_record() {
        navigate(ManagePersonsView.class);

        test(find(TextField.class).withCaption("First Name").single()).setValue("Test Name");
        test(find(ComboBox.class).withCaption("Country").single()).selectItem("Switzerland");
        test(find(DatePicker.class).withCaption("Birth Date").single())
                .setValue(LocalDate.of(1990, 1, 1));

        test(find(Button.class).withText("Save").single()).click();

        // Postcondition: the new person is listed — 100 from the test data plus the one created
        Grid<PersonRecord> grid = find(Grid.class).single();
        assertThat(test(grid).size()).isEqualTo(101);
        assertThat(grid.getGenericDataView().getItems().map(PersonRecord::getFirstName))
                .contains("Test Name");
    }

    @Test
    @UseCase(id = "UC-001", scenario = "A1: Required Field Missing", businessRules = {"BR-002"})
    void required_field_shows_validation_error() {
        navigate(ManagePersonsView.class);

        TextField nameField = find(TextField.class).withCaption("First Name").single();
        test(nameField).clear();
        test(find(Button.class).withText("Save").single()).click();

        // BR-002: the first name is required — message as the specification words it
        assertThat(nameField.isInvalid()).isTrue();
        assertThat(nameField.getErrorMessage()).isEqualTo("Field is required");
    }

    @Test
    @UseCase(id = "UC-001", scenario = "A2: Delete Confirmation")
    void delete_confirms_via_dialog() {
        navigate(ManagePersonsView.class);

        Grid<PersonRecord> grid = find(Grid.class).single();
        grid.select(test(grid).getRow(0));

        test(find(Button.class).withText("Delete").single()).click();

        ConfirmDialog dialog = find(ConfirmDialog.class).single();
        test(dialog).confirm();

        // Postcondition of A2: the selected person is removed
        assertThat(find(ConfirmDialog.class).exists()).isFalse();
        assertThat(test(grid).size()).isEqualTo(99);
    }
}
```
