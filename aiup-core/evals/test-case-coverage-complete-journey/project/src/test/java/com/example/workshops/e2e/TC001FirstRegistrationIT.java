package com.example.workshops.e2e;

import static com.example.workshops.db.tables.Registration.REGISTRATION;
import static com.example.workshops.db.tables.Workshop.WORKSHOP;
import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;

import org.jooq.DSLContext;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.context.annotation.Import;
import org.vaadin.addons.dramafinder.AbstractBasePlaywrightIT;
import org.vaadin.addons.dramafinder.element.ButtonElement;
import org.vaadin.addons.dramafinder.element.DateTimePickerElement;
import org.vaadin.addons.dramafinder.element.EmailFieldElement;
import org.vaadin.addons.dramafinder.element.GridElement;
import org.vaadin.addons.dramafinder.element.IntegerFieldElement;
import org.vaadin.addons.dramafinder.element.NotificationElement;
import org.vaadin.addons.dramafinder.element.PasswordFieldElement;
import org.vaadin.addons.dramafinder.element.TextFieldElement;

import com.example.workshops.TestcontainersConfiguration;
import com.example.workshops.usecase.TestCase;
import com.microsoft.playwright.assertions.PlaywrightAssertions;

/**
 * Executes test case TC-001 (docs/test_cases/TC-001-first-registration.md): an organizer creates a workshop
 * (UC-001), a participant registers for it (UC-002), and the organizer lists the participants (UC-003).
 */
@Import(TestcontainersConfiguration.class)
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
@TestCase(id = "TC-001", useCases = {"UC-001", "UC-002", "UC-003"})
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

    @BeforeEach
    void login() {
        TextFieldElement.getByLabel(page, "Username").setValue("organizer");
        PasswordFieldElement.getByLabel(page, "Password").setValue("organizer");
        ButtonElement.getByText(page, "Log in").click();
        page.waitForURL(url -> !url.contains("/login"));
        page.navigate(getUrl() + getView());
    }

    @Test
    @DisplayName("TC-001: First registration for a new workshop")
    void first_registration() {
        // Step 1: Create workshop
        createWorkshop(TITLE, "2027-03-15T09:00", "2");

        // Step 2: Verify workshop listed
        assertWorkshopListed(TITLE, "2027-03-15T09:00");

        // Step 3: Register participant
        GridElement upcoming = registerParticipant(TITLE, "Ada Keller", "ada.keller@example.com");

        // Step 4: Verify confirmation
        NotificationElement confirmation = new NotificationElement(page);
        PlaywrightAssertions.assertThat(confirmation.getContentLocator())
                .hasText("You are registered for Clean Architecture Basics.");

        // Validation 1: Free places
        List<Integer> rows = upcoming.findRowIndexesWithColumnText(0, TITLE);
        PlaywrightAssertions.assertThat(upcoming.findCell(rows.get(0), "Free places").get().getCellContentLocator())
                .hasText("1");

        // Step 5: List participants
        GridElement participants = listParticipants(TITLE);

        // Step 6: Verify participant
        assertThat(participants.getTotalRowCount()).isEqualTo(1);
        PlaywrightAssertions.assertThat(participants.findCell(0, "Name").get().getCellContentLocator())
                .hasText("Ada Keller");
        PlaywrightAssertions.assertThat(participants.findCell(0, "Email").get().getCellContentLocator())
                .hasText("ada.keller@example.com");

        // Validation 2: Registration count
        PlaywrightAssertions.assertThat(page.getByText("1 registration, 1 free place")).isVisible();
    }

    private void createWorkshop(String title, String start, String capacity) {
        GridElement workshops = GridElement.get(page);
        workshops.waitForGridToStopLoading();
        TextFieldElement.getByLabel(page, "Title").setValue(title);
        DateTimePickerElement.getByLabel(page, "Start").setValue(start);
        IntegerFieldElement.getByLabel(page, "Capacity").setValue(capacity);
        ButtonElement.getByText(page, "Save").click();
        PlaywrightAssertions.assertThat(new NotificationElement(page).getContentLocator()).hasText("Workshop saved");
    }

    private void assertWorkshopListed(String title, String start) {
        GridElement workshops = GridElement.get(page);
        workshops.waitForGridToStopLoading();
        List<Integer> listed = workshops.findRowIndexesWithColumnText(0, title);
        assertThat(listed).hasSize(1);
        PlaywrightAssertions.assertThat(workshops.findCell(listed.get(0), "Start").get().getCellContentLocator())
                .hasText(start);
    }

    private GridElement registerParticipant(String title, String name, String email) {
        // The application offers no navigation from the workshop list to the registration view
        page.navigate(getUrl() + "register");
        GridElement upcoming = GridElement.get(page);
        upcoming.waitForGridToStopLoading();
        upcoming.select(upcoming.findRowIndexesWithColumnText(0, title).get(0));
        TextFieldElement.getByLabel(page, "Name").setValue(name);
        EmailFieldElement.getByLabel(page, "Email").setValue(email);
        ButtonElement.getByText(page, "Register").click();
        return upcoming;
    }

    private GridElement listParticipants(String title) {
        page.navigate(getUrl() + "workshops");
        GridElement workshops = GridElement.get(page);
        workshops.waitForGridToStopLoading();
        workshops.select(workshops.findRowIndexesWithColumnText(0, title).get(0));
        ButtonElement.getByText(page, "Participants").click();
        GridElement participants = GridElement.getById(page, "participant-grid");
        participants.waitForGridToStopLoading();
        return participants;
    }

    @AfterEach
    void cleanUpTestCaseData() {
        // Postconditions: the registration must be deleted before the workshop it belongs to
        dsl.deleteFrom(REGISTRATION)
                .where(REGISTRATION.WORKSHOP_ID.in(dsl.select(WORKSHOP.ID).from(WORKSHOP).where(WORKSHOP.TITLE.eq(TITLE))))
                .execute();
        dsl.deleteFrom(WORKSHOP).where(WORKSHOP.TITLE.eq(TITLE)).execute();
    }
}
