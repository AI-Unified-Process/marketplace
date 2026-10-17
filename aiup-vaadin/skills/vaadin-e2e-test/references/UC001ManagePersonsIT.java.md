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

import java.util.List;

import com.microsoft.playwright.Locator;
import com.microsoft.playwright.Page;
import com.microsoft.playwright.assertions.PlaywrightAssertions;
import com.microsoft.playwright.options.AriaRole;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.test.context.TestPropertySource;
import org.vaadin.addons.dramafinder.AbstractBasePlaywrightIT;
import org.vaadin.addons.dramafinder.element.ButtonElement;
import org.vaadin.addons.dramafinder.element.GridElement;
import org.vaadin.addons.dramafinder.element.NotificationElement;
import org.vaadin.addons.dramafinder.element.TextFieldElement;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Integration test for UC-001 "Manage Persons". Every expected value comes from the use case
 * specification or the Flyway test data (sorted by name), never from a run of the code.
 * AssertJ's assertThat checks values; Playwright's PlaywrightAssertions.assertThat checks
 * locators and retries until the browser shows the expected state.
 */
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
@TestPropertySource(properties = "spring.flyway.locations=classpath:db/migration,classpath:db/testdata")
@DisplayName("UC-001: Manage Persons")
class UC001ManagePersonsIT extends AbstractBasePlaywrightIT {

    // The one person these tests create; the test data holds no person with this email
    private static final String NEW_NAME = "Carol Miller";
    private static final String NEW_EMAIL = "carol.miller@example.com";
    private static final int EMAIL_COLUMN = 1;

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

    @AfterEach
    void removeCreatedPerson() {
        // Idempotent: the test may have failed before or after creating the person — and only
        // the person a test created, never a row of the shared test data
        page.navigate(getUrl() + getView());
        GridElement grid = GridElement.get(page);
        List<Integer> rows = grid.findRowIndexesWithColumnText(EMAIL_COLUMN, NEW_EMAIL);
        if (!rows.isEmpty()) {
            grid.select(rows.get(0));
            ButtonElement.getByText(page, "Delete").click();
            Locator confirm = confirmDialog("Confirm Delete");
            ButtonElement.getByText(confirm, "Delete").click();
            PlaywrightAssertions.assertThat(confirm).isHidden();
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

    // One @Nested group per scenario of the specification, named with its heading: the main success
    // scenario first, then one per alternative flow ("A1: …"). /use-case-coverage maps the groups by these names.

    @Nested
    @DisplayName("Main Success Scenario")
    class MainSuccessScenario {

        @Test
        @DisplayName("Step 1: Grid shows the persons on page load")
        void grid_displays_data() {
            GridElement grid = GridElement.get(page);

            // First row of the test data; assert rows, not the total, which other tests change
            var firstCell = grid.findCell(0, "Name");
            PlaywrightAssertions.assertThat(firstCell.get().getCellContentLocator()).hasText("Eula Lane");
        }

        @Test
        @DisplayName("Step 1: Grid headers match the columns the specification lists")
        void grid_has_expected_headers() {
            GridElement grid = GridElement.get(page);

            assertThat(grid.getHeaderCellContents()).contains("Name", "Email", "Status");
        }

        @Test
        @DisplayName("Step 2: Selecting a row populates the form")
        void select_row_populates_form() {
            GridElement grid = GridElement.get(page);
            grid.select(0);

            // First row of the test data — not read back from the grid, which would only
            // compare the view with itself
            TextFieldElement nameField = TextFieldElement.getByLabel(page, "Name");
            nameField.assertValue("Eula Lane");
        }

        @Test
        @DisplayName("Steps 3–5: Saving a new person shows the message and lists the person")
        void save_lists_new_person() {
            TextFieldElement.getByLabel(page, "Name").setValue(NEW_NAME);
            TextFieldElement.getByLabel(page, "Email").setValue(NEW_EMAIL);
            ButtonElement.getByText(page, "Save").click();

            NotificationElement notification = new NotificationElement(page);
            PlaywrightAssertions.assertThat(notification.getContentLocator()).hasText("Person saved");

            GridElement grid = GridElement.get(page);
            List<Integer> rows = grid.findRowIndexesWithColumnText(EMAIL_COLUMN, NEW_EMAIL);
            assertThat(rows).hasSize(1);
            var nameCell = grid.findCell(rows.get(0), "Name");
            PlaywrightAssertions.assertThat(nameCell.get().getCellContentLocator()).hasText(NEW_NAME);
        }

    }

    @Nested
    @DisplayName("A1: Required Field Missing")
    class A1RequiredFieldMissing {

        @Test
        @DisplayName("BR-002: Required field shows the error when empty")
        void required_field_shows_error() {
            // A new person without a name — no row of the test data is touched
            TextFieldElement nameField = TextFieldElement.getByLabel(page, "Name");
            TextFieldElement.getByLabel(page, "Email").setValue(NEW_EMAIL);

            ButtonElement saveButton = ButtonElement.getByText(page, "Save");
            saveButton.click();

            // BR-002: the name is required — message as the specification words it
            nameField.assertInvalid();
            nameField.assertErrorMessage("Field is required");
        }

    }

    @Nested
    @DisplayName("A2: Delete Confirmation")
    class A2DeleteConfirmation {

        @Test
        @DisplayName("Cancelling the confirmation keeps the person")
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
            var firstCell = grid.findCell(0, "Name");
            PlaywrightAssertions.assertThat(firstCell.get().getCellContentLocator()).hasText("Eula Lane");
        }

    }

}
```
