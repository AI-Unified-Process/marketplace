package com.example.app.rooms;

import com.example.app.usecase.UseCase;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.grid.Grid;
import com.github.mvysny.kaributesting.v10.MockVaadin;
import com.github.mvysny.kaributesting.v10.Routes;
import org.junit.jupiter.api.*;
import org.springframework.boot.test.context.SpringBootTest;

import static com.github.mvysny.kaributesting.v10.LocatorJ.*;
import static com.github.mvysny.kaributesting.v10.NotificationsKt.expectNotifications;
import static org.assertj.core.api.Assertions.assertThat;

import com.vaadin.flow.component.UI;
import com.github.mvysny.kaributesting.v10.GridKt;

@SpringBootTest
class UC005ManageRoomsTest {

    @BeforeEach
    void setup() {
        UI.getCurrent().navigate(RoomsView.class);
    }

    @AfterEach
    void tearDown() {
        // Remove only data created during this test (none — all data is from Flyway migrations)
    }

    @Test
    @UseCase(id = "UC-005")
    void rooms_are_displayed_in_grid() {
        var grid = _get(Grid.class);
        assertThat(GridKt._size(grid)).isGreaterThan(0);
    }

    @Test
    @UseCase(id = "UC-005", scenario = "A1: Room Name Already Exists")
    void adding_room_with_duplicate_name_shows_error() {
        _get(Button.class, spec -> spec.withCaption("Add Room"))._click();
        // Fill name that already exists in migration data
        _get(com.vaadin.flow.component.textfield.TextField.class, spec -> spec.withLabel("Room Name"))
                ._setValue("Conference Room A");
        _get(Button.class, spec -> spec.withCaption("Save"))._click();
        expectNotifications("Room name already exists");
    }
}
