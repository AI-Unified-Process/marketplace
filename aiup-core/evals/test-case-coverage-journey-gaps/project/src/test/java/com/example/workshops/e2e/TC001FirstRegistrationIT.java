package com.example.workshops.e2e;

import static com.example.workshops.db.tables.Registration.REGISTRATION;
import static com.example.workshops.db.tables.Workshop.WORKSHOP;
import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;

import org.jooq.DSLContext;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.vaadin.addons.dramafinder.AbstractBasePlaywrightIT;
import org.vaadin.addons.dramafinder.element.ButtonElement;
import org.vaadin.addons.dramafinder.element.CheckboxElement;
import org.vaadin.addons.dramafinder.element.DateTimePickerElement;
import org.vaadin.addons.dramafinder.element.GridElement;
import org.vaadin.addons.dramafinder.element.NotificationElement;
import org.vaadin.addons.dramafinder.element.EmailFieldElement;
import org.vaadin.addons.dramafinder.element.IntegerFieldElement;
import org.vaadin.addons.dramafinder.element.TextFieldElement;

import com.microsoft.playwright.assertions.PlaywrightAssertions;

/**
 * Executes test case TC-001 (docs/test_cases/TC-001-first-registration.md): an organizer creates a workshop
 * (UC-001), a participant registers for it (UC-002), and the organizer lists the participants (UC-003).
 */
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
class TC001FirstRegistrationIT extends AbstractBasePlaywrightIT {

    private static final String TITLE = "Clean Architecture Basics";

    @LocalServerPort
    private int port;

    @Autowired
    private DSLContext dsl;

    @Override
    public String getUrl() {
        return String.format("http://localhost:%d/", port);
    }

    @Override
    public String getView() {
        return "workshops";
    }

    @Test
    @DisplayName("TC-001: First registration for a new workshop")
    void first_registration() {
        login("organizer");

        // Step 1: Create workshop (UC-001)
        TextFieldElement.getByLabel(page, "Title").setValue(TITLE);
        DateTimePickerElement.getByLabel(page, "Start").setValue("2027-03-15T09:00");
        IntegerFieldElement.getByLabel(page, "Capacity").setValue("2");
        ButtonElement.getByText(page, "Save").click();

        // Step 2: Verify workshop listed
        GridElement workshops = GridElement.get(page);
        List<Integer> listed = workshops.findRowIndexesWithColumnText(0, TITLE);
        assertThat(listed).hasSize(1);
        PlaywrightAssertions.assertThat(workshops.findCell(listed.get(0), "Start").get().getCellContentLocator())
                .hasText("2027-03-15T09:00");

        // Step 3: Register participant (UC-002)
        page.navigate(getUrl() + "register");
        GridElement upcoming = GridElement.get(page);
        upcoming.select(upcoming.findRowIndexesWithColumnText(0, TITLE).get(0));
        TextFieldElement.getByLabel(page, "Name").setValue("Ada Keller");
        EmailFieldElement.getByLabel(page, "Email").setValue("ada.keller@example.com");
        CheckboxElement.getByLabel(page, "I accept the terms and conditions").check();
        ButtonElement.getByText(page, "Register").click();

        // Step 4: Verify confirmation
        NotificationElement confirmation = new NotificationElement(page);
        PlaywrightAssertions.assertThat(confirmation.getContentLocator())
                .hasText("You are registered for Clean Architecture Basics.");

        // Validation 1: Free places
        List<Integer> rows = upcoming.findRowIndexesWithColumnText(0, TITLE);
        PlaywrightAssertions.assertThat(upcoming.findCell(rows.get(0), "Free places").get().getCellContentLocator())
                .hasText("1");

        // Step 5: List participants (UC-003)
        long workshopId = dsl.select(WORKSHOP.ID).from(WORKSHOP).where(WORKSHOP.TITLE.eq(TITLE)).fetchSingle(WORKSHOP.ID);
        page.navigate(getUrl() + "workshops/" + workshopId + "/participants");
        GridElement.get(page).assertVisible();
    }

    @AfterEach
    void cleanUpTestCaseData() {
        // The registration must be deleted before the workshop it belongs to
        dsl.deleteFrom(REGISTRATION)
                .where(REGISTRATION.WORKSHOP_ID.in(dsl.select(WORKSHOP.ID).from(WORKSHOP).where(WORKSHOP.TITLE.eq(TITLE))))
                .execute();
        dsl.deleteFrom(WORKSHOP).where(WORKSHOP.TITLE.eq(TITLE)).execute();
    }

    private void login(String username) {
        page.navigate(getUrl() + "login");
        TextFieldElement.getByLabel(page, "Username").setValue(username);
        page.getByLabel("Password").fill("organizer");
        ButtonElement.getByText(page, "Log in").click();
        page.navigate(getUrl() + getView());
    }
}
