package com.example.app.views;

import java.time.LocalDate;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.vaadin.addons.dramafinder.AbstractBasePlaywrightIT;
import org.vaadin.addons.dramafinder.element.button.ButtonElement;
import org.vaadin.addons.dramafinder.element.checkbox.CheckboxElement;
import org.vaadin.addons.dramafinder.element.combobox.ComboBoxElement;
import org.vaadin.addons.dramafinder.element.datepicker.DatePickerElement;
import org.vaadin.addons.dramafinder.element.dialog.DialogElement;
import org.vaadin.addons.dramafinder.element.grid.GridElement;
import org.vaadin.addons.dramafinder.element.notification.NotificationElement;
import org.vaadin.addons.dramafinder.element.textfield.TextFieldElement;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
class ExampleViewIT extends AbstractBasePlaywrightIT {

    @LocalServerPort
    private int port;

    @Override
    public String getUrl() {
        return String.format("http://localhost:%d/", port);
    }

    @Override
    public String getView() {
        return "example";
    }

    @Nested
    @DisplayName("Grid Display")
    class GridDisplay {

        @Test
        @DisplayName("Grid shows data on page load")
        void grid_displays_data() {
            GridElement grid = GridElement.get(page);

            // Use total count — viewport limits rendered rows
            assertThat(grid.getTotalRowCount()).isGreaterThan(0);
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
            var cell = grid.findCell(0, "Name");
            String expectedName = cell.get().getCellContentLocator().innerText();

            grid.select(0);

            TextFieldElement nameField = TextFieldElement.getByLabel(page, "Name");
            nameField.assertValue(expectedName);
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
            assertThat(updatedCell.get().getCellContentLocator()).hasText("Updated Name");
        }

    }

    @Nested
    @DisplayName("Form Validation")
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

            nameField.assertInvalid();
            nameField.assertErrorMessage("Field is required");
        }

    }

    @Nested
    @DisplayName("Dialog Interactions")
    class DialogInteractions {

        @Test
        @DisplayName("Delete button opens confirmation dialog")
        void delete_opens_confirm_dialog() {
            GridElement grid = GridElement.get(page);
            grid.select(0);

            ButtonElement deleteButton = ButtonElement.getByText(page, "Delete");
            deleteButton.click();

            DialogElement dialog = DialogElement.getByHeaderText(page, "Confirm Delete");
            dialog.assertOpen();

            ButtonElement cancelButton = ButtonElement.getByText(dialog.getLocator(), "Cancel");
            cancelButton.click();

            dialog.assertClosed();
        }

    }

}
