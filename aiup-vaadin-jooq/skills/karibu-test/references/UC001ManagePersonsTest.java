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
 *
 * <p>Class name follows the AI Unified Process convention {@code UC<id><PascalCaseUseCaseName>Test}; every test
 * method is annotated with {@link UseCase} so the AI Unified Process IntelliJ Navigator plugin can link this
 * file to {@code docs/use-cases/UC-001-manage-persons.md}.
 */
class UC001ManagePersonsTest extends KaribuTest {

    private static Routes routes;

    @Test
    @UseCase(id = "UC-001")
    void view_displays_grid_with_data() {
        UI.getCurrent().navigate(ManagePersonsView.class);

        var grid = _get(Grid.class);
        assertThat(GridKt._size(grid)).isGreaterThan(0);
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

        expectNotifications("Saved successfully");
    }

    @Test
    @UseCase(id = "UC-001")
    void form_submission_creates_record() {
        UI.getCurrent().navigate(ManagePersonsView.class);

        _setValue(_get(TextField.class, spec -> spec.withLabel("Name")), "Test Name");
        _click(_get(Button.class, spec -> spec.withCaption("Save")));

        var grid = _get(Grid.class);
        assertThat(GridKt._size(grid)).isEqualTo(1);
    }

    @Test
    @UseCase(id = "UC-001", scenario = "A1: Required Field Missing", businessRules = {"BR-002"})
    void required_field_shows_validation_error() {
        UI.getCurrent().navigate(ManagePersonsView.class);

        TextField nameField = _get(TextField.class, spec -> spec.withLabel("Name"));
        _setValue(nameField, "");
        _click(_get(Button.class, spec -> spec.withCaption("Save")));

        assertThat(nameField.isInvalid()).isTrue();
    }
}
