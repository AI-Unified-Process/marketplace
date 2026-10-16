<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# UC001ManagePersonsIT.java

The source file `UC001ManagePersonsIT.java`, wrapped in Markdown so that every skill host installs it.
Use the content of the code block below; a copy written to disk takes the name `UC001ManagePersonsIT.java`.

```java
package com.example.app.views;

import java.time.LocalDate;

import com.microsoft.playwright.Locator;
import com.microsoft.playwright.Page;
import com.microsoft.playwright.assertions.PlaywrightAssertions;
import com.microsoft.playwright.options.AriaRole;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.vaadin.addons.dramafinder.AbstractBasePlaywrightIT;
import org.vaadin.addons.dramafinder.element.ButtonElement;
import org.vaadin.addons.dramafinder.element.CheckboxElement;
import org.vaadin.addons.dramafinder.element.ComboBoxElement;
import org.vaadin.addons.dramafinder.element.DatePickerElement;
import org.vaadin.addons.dramafinder.element.GridElement;
import org.vaadin.addons.dramafinder.element.NotificationElement;
import org.vaadin.addons.dramafinder.element.TextFieldElement;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Integration test for UC-001 "Manage Persons". Every expected value comes from the use case
 * specification or the Flyway test data (100 persons, sorted by name), never from a run of the code.
 */
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
@DisplayName("UC-001: Manage Persons")
class UC001ManagePersonsIT extends AbstractBasePlaywrightIT {

    @LocalServerPort
    private int port;

    @Override
    public String getUrl() {
        return String.format("http://localhost:%d/", port);
    }

    @Override
    public String getView() {
        return "persons";
    }

    @Nested
    @DisplayName("Grid Display")
    class GridDisplay {

        @Test
        @DisplayName("Grid shows data on page load")
        void grid_displays_data() {
            GridElement grid = GridElement.get(page);

            // Use total count — viewport limits rendered rows
            assertThat(grid.getTotalRowCount()).isEqualTo(100);
        }

        @Test
        @DisplayName("Grid headers match expected columns")
        void grid_has_expected_headers() {
            GridElement grid = GridElement.get(page);

            assertThat(grid.getHeaderCellContents()).contains("Name", "Email", "Status");
        }

    }

    @Nested
    @DisplayName("Row Selection and Form")
    class RowSelectionAndForm {

        @Test
        @DisplayName("Selecting a row populates the form")
        void select_row_populates_form() {
            GridElement grid = GridElement.get(page);
            grid.select(0);

            // First row of the test data — not read back from the grid, which would only
            // compare the view with itself
            TextFieldElement nameField = TextFieldElement.getByLabel(page, "Name");
            nameField.assertValue("Eula Lane");
        }

        @Test
        @DisplayName("Saving updates the grid cell")
        void save_updates_grid() {
            GridElement grid = GridElement.get(page);
            grid.select(0);

            TextFieldElement nameField = TextFieldElement.getByLabel(page, "Name");
            nameField.setValue("Updated Name");

            ButtonElement saveButton = ButtonElement.getByText(page, "Save");
            saveButton.click();

            var updatedCell = grid.findCell(0, "Name");
            PlaywrightAssertions.assertThat(updatedCell.get().getCellContentLocator()).hasText("Updated Name");
        }

    }

    @Nested
    @DisplayName("A1: Required Field Missing")
    class FormValidation {

        @Test
        @DisplayName("Required field shows error when empty")
        void required_field_shows_error() {
            GridElement grid = GridElement.get(page);
            grid.select(0);

            TextFieldElement nameField = TextFieldElement.getByLabel(page, "Name");
            nameField.clear();

            ButtonElement saveButton = ButtonElement.getByText(page, "Save");
            saveButton.click();

            // BR-002: the name is required — message as the specification words it
            nameField.assertInvalid();
            nameField.assertErrorMessage("Field is required");
        }

    }

    @Nested
    @DisplayName("A2: Delete Confirmation")
    class DialogInteractions {

        @Test
        @DisplayName("Delete button opens confirmation dialog")
        void delete_opens_confirm_dialog() {
            GridElement grid = GridElement.get(page);
            grid.select(0);

            ButtonElement deleteButton = ButtonElement.getByText(page, "Delete");
            deleteButton.click();

            Locator dialog = confirmDialog("Confirm Delete");
            PlaywrightAssertions.assertThat(dialog).isVisible();

            ButtonElement cancelButton = ButtonElement.getByText(dialog, "Cancel");
            cancelButton.click();

            // A2: cancelling keeps the person
            PlaywrightAssertions.assertThat(dialog).isHidden();
            assertThat(grid.getTotalRowCount()).isEqualTo(100);
        }

    }


    /**
     * The view's ConfirmDialog. Drama Finder has no wrapper for it, and DialogElement matches
     * <vaadin-dialog> only: <vaadin-confirm-dialog> carries the role "alertdialog" and its header
     * as accessible name (Vaadin 25), so locate it by role and name, narrowed to its tag.
     */
    private Locator confirmDialog(String header) {
        return page.getByRole(AriaRole.ALERTDIALOG, new Page.GetByRoleOptions().setName(header))
                .and(page.locator("vaadin-confirm-dialog"));
    }

}
```
