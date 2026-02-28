package com.example.app.views;

import com.microsoft.playwright.Locator;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class ExampleViewIT extends PlaywrightIT {

    @BeforeEach
    void setup() {
        // Navigate to the view under test
        page.navigate("http://localhost:%d/example".formatted(localServerPort));
        mopo.waitForConnectionToSettle();
    }

    @Test
    void grid_displays_data() {
        GridPw gridPw = new GridPw(page);

        // Viewport may limit rendered rows
        Assertions.assertThat(gridPw.getRenderedRowCount()).isGreaterThan(0);
    }

    @Test
    void select_row_populates_form() {
        GridPw gridPw = new GridPw(page);
        GridPw.RowPw row = gridPw.getRow(0);
        String expectedName = row.getCell(0).innerText();

        row.select();
        mopo.waitForConnectionToSettle();

        Locator nameField = page.locator("vaadin-text-field")
            .filter(new Locator.FilterOptions().setHasText("Name"))
            .locator("input");

        Assertions.assertThat(nameField.inputValue()).isEqualTo(expectedName);
    }

    @Test
    void save_updates_grid() {
        GridPw gridPw = new GridPw(page);
        GridPw.RowPw row = gridPw.getRow(0);
        row.select();
        mopo.waitForConnectionToSettle();

        Locator nameField = page.locator("vaadin-text-field")
            .filter(new Locator.FilterOptions().setHasText("Name"))
            .locator("input");
        nameField.fill("Updated Name");

        page.locator("vaadin-button")
            .filter(new Locator.FilterOptions().setHasText("Save"))
            .click();
        mopo.waitForConnectionToSettle();

        GridPw.RowPw updatedRow = gridPw.getRow(0);
        Assertions.assertThat(updatedRow.getCell(0).innerText()).isEqualTo("Updated Name");
    }
}
