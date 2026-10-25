<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# TC001CustomerOnboardingIT.java

The source file `TC001CustomerOnboardingIT.java`, wrapped in Markdown so that every skill host installs it.
Use the content of the code block below; a copy written to disk takes the name `TC001CustomerOnboardingIT.java`.

```java
package com.example.app.e2e;

import java.util.List;

import com.example.app.TestcontainersConfiguration;
import com.example.app.usecase.TestCase;
import com.microsoft.playwright.Locator;
import com.microsoft.playwright.Page;
import com.microsoft.playwright.assertions.PlaywrightAssertions;
import com.microsoft.playwright.options.AriaRole;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.context.annotation.Import;
import org.vaadin.addons.dramafinder.AbstractBasePlaywrightIT;
import org.vaadin.addons.dramafinder.element.ButtonElement;
import org.vaadin.addons.dramafinder.element.ComboBoxElement;
import org.vaadin.addons.dramafinder.element.DialogElement;
import org.vaadin.addons.dramafinder.element.GridElement;
import org.vaadin.addons.dramafinder.element.NotificationElement;
import org.vaadin.addons.dramafinder.element.EmailFieldElement;
import org.vaadin.addons.dramafinder.element.TextFieldElement;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Executes test case TC-001 (docs/test_cases/TC-001-customer-onboarding.md):
 * a new customer is created (UC-001) and places a first order (UC-004).
 * AssertJ's assertThat checks values; PlaywrightAssertions.assertThat checks locators and retries.
 */
@Import(TestcontainersConfiguration.class) // the database the project's other Spring tests use
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
@TestCase(id = "TC-001", useCases = {"UC-001", "UC-004"})
class TC001CustomerOnboardingIT extends AbstractBasePlaywrightIT {

    private static final String CUSTOMER_NAME = "Jane Doe";

    @LocalServerPort
    private int port;

    @Override
    public String getUrl() {
        return String.format("http://localhost:%d/", port);
    }

    @Override
    public String getView() {
        // Route of the first Flow step; later steps navigate onward
        return "customers";
    }

    @Test
    @DisplayName("TC-001: New customer can be onboarded and place a first order")
    void customer_onboarding() {
        // Step 1: Create customer (UC-001)
        createCustomer(CUSTOMER_NAME, "jane.doe@example.com");

        // Step 2: Customer appears in the customer list
        assertCustomerListed(CUSTOMER_NAME);

        // Step 3: Place first order for the new customer (UC-004)
        placeOrder(CUSTOMER_NAME, "Starter Kit");

        // Step 4: Order confirmation is shown — the full message the test case states
        NotificationElement confirmation = new NotificationElement(page);
        PlaywrightAssertions.assertThat(confirmation.getContentLocator()).hasText("Order placed for Jane Doe");

        // Validation 1: Customer status is Active after the first order
        assertCustomerStatus(CUSTOMER_NAME, "Active");
    }

    private void createCustomer(String name, String email) {
        ButtonElement.getByText(page, "Add Customer").click();

        DialogElement dialog = DialogElement.getByHeaderText(page, "New Customer");
        TextFieldElement.getByLabel(dialog.getLocator(), "Name").setValue(name);
        EmailFieldElement.getByLabel(dialog.getLocator(), "Email").setValue(email);
        ButtonElement.getByText(dialog.getLocator(), "Save").click();

        dialog.assertClosed();
    }

    private void assertCustomerListed(String name) {
        GridElement grid = GridElement.get(page);
        grid.waitForGridToStopLoading();
        assertThat(grid.findRowIndexesWithColumnText(0, name)).isNotEmpty();
    }

    private void placeOrder(String customer, String product) {
        // Prefer navigating through the UI (side navigation, buttons); fall
        // back to direct navigation when the UI offers no path
        page.navigate(getUrl() + "orders");
        GridElement grid = GridElement.get(page);
        grid.waitForGridToStopLoading();
        grid.assertVisible();

        ButtonElement.getByText(page, "New Order").click();

        DialogElement dialog = DialogElement.getByHeaderText(page, "New Order");
        ComboBoxElement.getByLabel(dialog.getLocator(), "Customer").selectItem(customer);
        ComboBoxElement.getByLabel(dialog.getLocator(), "Product").selectItem(product);
        ButtonElement.getByText(dialog.getLocator(), "Place Order").click();

        dialog.assertClosed();
    }

    private void assertCustomerStatus(String name, String expectedStatus) {
        page.navigate(getUrl() + "customers");
        GridElement grid = GridElement.get(page);
        grid.waitForGridToStopLoading();

        List<Integer> rows = grid.findRowIndexesWithColumnText(0, name);
        assertThat(rows).isNotEmpty();
        var statusCell = grid.findCell(rows.get(0), "Status");
        PlaywrightAssertions.assertThat(statusCell.get().getCellContentLocator()).hasText(expectedStatus);
    }

    @AfterEach
    void cleanUpTestCaseData() {
        // Idempotent: the test may have failed midway, so remove only
        // what actually exists — and only data this test case created
        deleteOrderIfPresent(CUSTOMER_NAME);
        deleteCustomerIfPresent(CUSTOMER_NAME);
    }

    private void deleteOrderIfPresent(String customer) {
        page.navigate(getUrl() + "orders");
        GridElement grid = GridElement.get(page);
        grid.waitForGridToStopLoading();

        List<Integer> rows = grid.findRowIndexesWithColumnText(0, customer);
        if (!rows.isEmpty()) {
            grid.select(rows.get(0));
            ButtonElement.getByText(page, "Delete").click();
            Locator confirm = confirmDialog("Confirm Delete");
            ButtonElement.getByText(confirm, "Confirm").click();
            PlaywrightAssertions.assertThat(confirm).isHidden();
        }
    }

    private void deleteCustomerIfPresent(String name) {
        page.navigate(getUrl() + "customers");
        GridElement grid = GridElement.get(page);
        grid.waitForGridToStopLoading();

        List<Integer> rows = grid.findRowIndexesWithColumnText(0, name);
        if (!rows.isEmpty()) {
            grid.select(rows.get(0));
            ButtonElement.getByText(page, "Delete").click();
            Locator confirm = confirmDialog("Confirm Delete");
            ButtonElement.getByText(confirm, "Confirm").click();
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

}
```
