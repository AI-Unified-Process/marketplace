package com.example.app.views;

import com.github.mvysny.kaributesting.v10.MockVaadin;
import com.github.mvysny.kaributesting.v10.Routes;
import com.github.mvysny.kaributesting.v10.GridKt;
import com.github.mvysny.kaributesting.v10.NotificationsKt;
import com.vaadin.flow.component.UI;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.grid.Grid;
import com.vaadin.flow.component.textfield.TextField;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static com.github.mvysny.kaributesting.v10.LocatorJ._click;
import static com.github.mvysny.kaributesting.v10.LocatorJ._get;
import static com.github.mvysny.kaributesting.v10.LocatorJ._find;
import static com.github.mvysny.kaributesting.v10.LocatorJ._setValue;
import static com.github.mvysny.kaributesting.v10.NotificationsKt.expectNotifications;
import static org.assertj.core.api.Assertions.assertThat;

class ExampleViewTest extends KaribuTest {

    private static Routes routes;

    @Test
    void view_displays_grid_with_data() {
        UI.getCurrent().navigate(ExampleView.class);

        var grid = _get(Grid.class);
        assertThat(GridKt._size(grid)).isGreaterThan(0);
    }

    @Test
    void click_column_action() {
        UI.getCurrent().navigate(ExampleView.class);

        var grid = _get(Grid.class);
        assertThat(GridKt._size(grid)).isEqualTo(100);

        Set<PersonRecord> selectedItems = grid.getSelectedItems();
        assertThat(selectedItems).hasSize(1).first().extracting(PersonRecord::getFirstName).isEqualTo("Eula");

        // Get component Column from Grid
        GridKt._getCellComponent(grid, 0, "actions")
                .getChildren()
                .filter(Button.class::isInstance)
                .findFirst()
                .map(Button.class::cast)
                .ifPresent(Button::click);
    }

    @Test
    void click_button_shows_notification() {
        UI.getCurrent().navigate(ExampleView.class);

        _click(_get(Button.class, spec -> spec.withCaption("Save")));

        expectNotifications("Saved successfully");
    }

    @Test
    void form_submission_creates_record() {
        UI.getCurrent().navigate(ExampleView.class);

        _setValue(_get(TextField.class, spec -> spec.withLabel("Name")), "Test Name");
        _click(_get(Button.class, spec -> spec.withCaption("Save")));

        var grid = _get(Grid.class);
        assertThat(GridKt._size(grid)).isEqualTo(1);
    }
}
