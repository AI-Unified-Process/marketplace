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

import java.util.Set;

import com.example.app.usecase.UseCase;
import com.github.mvysny.kaributesting.v10.GridKt;
import com.github.mvysny.kaributesting.v10.Routes;
import com.vaadin.flow.component.UI;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.grid.Grid;
import com.vaadin.flow.component.textfield.TextField;

import org.junit.jupiter.api.Test;

import static com.github.mvysny.kaributesting.v10.LocatorJ._click;
import static com.github.mvysny.kaributesting.v10.LocatorJ._get;
import static com.github.mvysny.kaributesting.v10.LocatorJ._setValue;
import static com.github.mvysny.kaributesting.v10.NotificationsKt.expectNotifications;
import static org.assertj.core.api.Assertions.assertThat;

/**
 * Use case test for UC-001 "Manage Persons".
 */
class UC001ManagePersonsTest extends KaribuTest {

    private static Routes routes;

    @Test
    @UseCase(id = "UC-001")
    void view_displays_grid_with_data() {
        UI.getCurrent().navigate(ManagePersonsView.class);

        // Expected values come from the Flyway test data (100 persons, sorted by first name),
        // never from a run of the code.
        Grid<PersonRecord> grid = _get(Grid.class);
        assertThat(GridKt._size(grid)).isEqualTo(100);
        assertThat(GridKt._get(grid, 0).getFirstName()).isEqualTo("Eula");
    }

    @Test
    @UseCase(id = "UC-001")
    void click_column_action() {
        UI.getCurrent().navigate(ManagePersonsView.class);

        var grid = _get(Grid.class);
        assertThat(GridKt._size(grid)).isEqualTo(100);

        Set<PersonRecord> selectedItems = grid.getSelectedItems();
        assertThat(selectedItems)
                .hasSize(1)
                .first()
                .extracting(PersonRecord::getFirstName)
                .isEqualTo("Eula");

        GridKt._getCellComponent(grid, 0, "actions")
                .getChildren()
                .filter(Button.class::isInstance)
                .findFirst()
                .map(Button.class::cast)
                .ifPresent(Button::click);
    }

    @Test
    @UseCase(id = "UC-001")
    void click_button_shows_notification() {
        UI.getCurrent().navigate(ManagePersonsView.class);

        _click(_get(Button.class, spec -> spec.withCaption("Save")));

        // Main success scenario step 4: the exact message the specification states
        expectNotifications("Saved successfully");
    }

    @Test
    @UseCase(id = "UC-001")
    void form_submission_creates_record() {
        UI.getCurrent().navigate(ManagePersonsView.class);

        _setValue(_get(TextField.class, spec -> spec.withLabel("First Name")), "Test Name");
        _click(_get(Button.class, spec -> spec.withCaption("Save")));

        // Postcondition: the new person is listed — 100 from the test data plus the one created
        Grid<PersonRecord> grid = _get(Grid.class);
        assertThat(GridKt._size(grid)).isEqualTo(101);
        assertThat(GridKt._findAll(grid)).extracting(PersonRecord::getFirstName).contains("Test Name");
    }

    @Test
    @UseCase(id = "UC-001", scenario = "A1: Required Field Missing", businessRules = {"BR-002"})
    void required_field_shows_validation_error() {
        UI.getCurrent().navigate(ManagePersonsView.class);

        TextField nameField = _get(TextField.class, spec -> spec.withLabel("First Name"));
        _setValue(nameField, "");
        _click(_get(Button.class, spec -> spec.withCaption("Save")));

        // BR-002: the first name is required — message as the specification words it
        assertThat(nameField.isInvalid()).isTrue();
        assertThat(nameField.getErrorMessage()).isEqualTo("Field is required");
    }
}
```
