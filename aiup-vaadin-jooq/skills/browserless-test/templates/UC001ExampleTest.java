package com.example.app.views;

import java.time.LocalDate;
import java.util.Set;

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

@SpringBootTest
class UC001ExampleTest extends SpringBrowserlessTest {

    @Test
    void view_displays_grid_with_data() {
        navigate(ExampleView.class);

        Grid<PersonRecord> grid = $(Grid.class).single();
        assertThat(test(grid).size()).isGreaterThan(0);
    }

    @Test
    void grid_row_can_be_selected() {
        navigate(ExampleView.class);

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
    void click_button_shows_notification() {
        navigate(ExampleView.class);

        test($(Button.class).withText("Save").single()).click();

        Notification notification = $(Notification.class).single();
        assertThat(test(notification).getText()).isEqualTo("Saved successfully");
    }

    @Test
    void form_submission_creates_record() {
        navigate(ExampleView.class);

        test($(TextField.class).withCaption("Name").single()).setValue("Test Name");
        test($(ComboBox.class).withCaption("Country").single()).selectItem("Switzerland");
        test($(DatePicker.class).withCaption("Birth Date").single())
                .setValue(LocalDate.of(1990, 1, 1));

        test($(Button.class).withText("Save").single()).click();

        Grid<PersonRecord> grid = $(Grid.class).single();
        assertThat(test(grid).size()).isEqualTo(1);
    }

    @Test
    void required_field_shows_validation_error() {
        navigate(ExampleView.class);

        TextField nameField = $(TextField.class).withCaption("Name").single();
        test(nameField).clear();
        test($(Button.class).withText("Save").single()).click();

        assertThat(nameField.isInvalid()).isTrue();
        assertThat(nameField.getErrorMessage()).isEqualTo("Field is required");
    }

    @Test
    void delete_confirms_via_dialog() {
        navigate(ExampleView.class);

        Grid<PersonRecord> grid = $(Grid.class).single();
        grid.select(test(grid).getRow(0));

        test($(Button.class).withText("Delete").single()).click();

        ConfirmDialog dialog = $(ConfirmDialog.class).single();
        test(dialog).confirm();

        assertThat($(ConfirmDialog.class).exists()).isFalse();
        assertThat(test(grid).size()).isEqualTo(99);
    }
}
