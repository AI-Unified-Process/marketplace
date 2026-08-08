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
import com.vaadin.testbench.unit.SpringBrowserlessTest;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Use case test for UC-001 "Manage Persons".
 *
 * <p>Class name follows the AI Unified Process convention {@code UC<id><PascalCaseUseCaseName>Test}; every test
 * method is annotated with {@link UseCase} so the AI Unified Process IntelliJ Navigator plugin can link this
 * file to {@code docs/use-cases/UC-001-manage-persons.md}.
 */
@SpringBootTest
class UC001ManagePersonsTest extends SpringBrowserlessTest {

    @Test
    @UseCase(id = "UC-001")
    void view_displays_grid_with_data() {
        navigate(ManagePersonsView.class);

        Grid<PersonRecord> grid = $(Grid.class).single();
        assertThat(test(grid).size()).isGreaterThan(0);
    }

    @Test
    @UseCase(id = "UC-001")
    void grid_row_can_be_selected() {
        navigate(ManagePersonsView.class);

        Grid<PersonRecord> grid = $(Grid.class).single();
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

        test($(Button.class).withText("Save").single()).click();

        Notification notification = $(Notification.class).single();
        assertThat(test(notification).getText()).isEqualTo("Saved successfully");
    }

    @Test
    @UseCase(id = "UC-001")
    void form_submission_creates_record() {
        navigate(ManagePersonsView.class);

        test($(TextField.class).withCaption("Name").single()).setValue("Test Name");
        test($(ComboBox.class).withCaption("Country").single()).selectItem("Switzerland");
        test($(DatePicker.class).withCaption("Birth Date").single())
                .setValue(LocalDate.of(1990, 1, 1));

        test($(Button.class).withText("Save").single()).click();

        Grid<PersonRecord> grid = $(Grid.class).single();
        assertThat(test(grid).size()).isEqualTo(1);
    }

    @Test
    @UseCase(id = "UC-001", scenario = "A1: Required Field Missing", businessRules = {"BR-002"})
    void required_field_shows_validation_error() {
        navigate(ManagePersonsView.class);

        TextField nameField = $(TextField.class).withCaption("Name").single();
        test(nameField).clear();
        test($(Button.class).withText("Save").single()).click();

        assertThat(nameField.isInvalid()).isTrue();
        assertThat(nameField.getErrorMessage()).isEqualTo("Field is required");
    }

    @Test
    @UseCase(id = "UC-001", scenario = "A2: Delete Confirmation")
    void delete_confirms_via_dialog() {
        navigate(ManagePersonsView.class);

        Grid<PersonRecord> grid = $(Grid.class).single();
        grid.select(test(grid).getRow(0));

        test($(Button.class).withText("Delete").single()).click();

        ConfirmDialog dialog = $(ConfirmDialog.class).single();
        test(dialog).confirm();

        assertThat($(ConfirmDialog.class).exists()).isFalse();
        assertThat(test(grid).size()).isEqualTo(99);
    }
}
