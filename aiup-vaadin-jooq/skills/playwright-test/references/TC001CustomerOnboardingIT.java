package com.example.app.e2e;

import java.util.List;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.vaadin.addons.dramafinder.AbstractBasePlaywrightIT;
import org.vaadin.addons.dramafinder.element.button.ButtonElement;
import org.vaadin.addons.dramafinder.element.combobox.ComboBoxElement;
import org.vaadin.addons.dramafinder.element.dialog.DialogElement;
import org.vaadin.addons.dramafinder.element.grid.GridElement;
import org.vaadin.addons.dramafinder.element.notification.NotificationElement;
import org.vaadin.addons.dramafinder.element.textfield.EmailFieldElement;
import org.vaadin.addons.dramafinder.element.textfield.TextFieldElement;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Executes test case TC-001 (docs/test_cases/TC-001-customer-onboarding.md):
 * a new customer is created (UC-001) and places a first order (UC-004).
 *
 * One test case = one test class = one test method; each Flow row from the
 * test case document is a private step method, called in order.
 */
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
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

        // Step 4: Order confirmation is shown
        NotificationElement confirmation = new NotificationElement(page);
        confirmation.assertOpen();

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
        assertThat(grid.findRowIndexesWithColumnText(0, name)).isNotEmpty();
    }

    private void placeOrder(String customer, String product) {
        // Prefer navigating through the UI (side navigation, buttons); fall
        // back to direct navigation when the UI offers no path
        page.navigate(getUrl() + "orders");
        GridElement grid = GridElement.get(page);
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

        List<Integer> rows = grid.findRowIndexesWithColumnText(0, name);
        assertThat(rows).isNotEmpty();
        var statusCell = grid.findCell(rows.get(0), "Status");
        assertThat(statusCell.get().getCellContentLocator()).hasText(expectedStatus);
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

        List<Integer> rows = grid.findRowIndexesWithColumnText(0, customer);
        if (!rows.isEmpty()) {
            grid.select(rows.get(0));
            ButtonElement.getByText(page, "Delete").click();
            DialogElement confirm = DialogElement.getByHeaderText(page, "Confirm Delete");
            ButtonElement.getByText(confirm.getLocator(), "Confirm").click();
            confirm.assertClosed();
        }
    }

    private void deleteCustomerIfPresent(String name) {
        page.navigate(getUrl() + "customers");
        GridElement grid = GridElement.get(page);

        List<Integer> rows = grid.findRowIndexesWithColumnText(0, name);
        if (!rows.isEmpty()) {
            grid.select(rows.get(0));
            ButtonElement.getByText(page, "Delete").click();
            DialogElement confirm = DialogElement.getByHeaderText(page, "Confirm Delete");
            ButtonElement.getByText(confirm.getLocator(), "Confirm").click();
            confirm.assertClosed();
        }
    }

}
