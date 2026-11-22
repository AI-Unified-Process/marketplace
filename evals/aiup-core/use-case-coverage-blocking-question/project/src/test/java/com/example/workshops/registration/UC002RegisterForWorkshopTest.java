package com.example.workshops.registration;

import static com.example.workshops.db.tables.Registration.REGISTRATION;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;

import org.jooq.DSLContext;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;

import com.example.workshops.TestcontainersConfiguration;
import com.example.workshops.usecase.UseCase;
import com.vaadin.browserless.SpringBrowserlessTest;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.grid.Grid;
import com.vaadin.flow.component.notification.Notification;
import com.vaadin.flow.component.textfield.EmailField;
import com.vaadin.flow.component.textfield.TextField;

import jakarta.validation.ConstraintViolationException;

@SpringBootTest(classes = {TestcontainersConfiguration.class, UC002RegisterForWorkshopTest.FixedClock.class})
class UC002RegisterForWorkshopTest extends SpringBrowserlessTest {

    private static final String ADA = "ada.keller@example.com";

    @TestConfiguration
    static class FixedClock {
        @Bean
        @Primary
        Clock clock() {
            return Clock.fixed(Instant.parse("2027-01-10T10:00:00Z"), ZoneOffset.UTC);
        }
    }

    @Autowired
    private DSLContext dsl;

    @Autowired
    private RegistrationService registrationService;

    @AfterEach
    void removeCreatedRows() {
        dsl.deleteFrom(REGISTRATION).where(REGISTRATION.PARTICIPANT_EMAIL.eq(ADA)).execute();
    }

    @Test
    @UseCase(id = "UC-002", businessRules = {"BR-001", "BR-002"})
    void participant_registers_for_workshop_with_free_places() {
        navigate(RegisterForWorkshopView.class);
        UpcomingWorkshop ddd = row("Domain-Driven Design");
        assertThat(ddd.startsAt()).hasToString("2027-02-01T09:00");
        assertThat(ddd.freePlaces()).isEqualTo(19);

        register(ddd, "Ada Keller", ADA);

        assertThat(test($(Notification.class).last()).getText())
                .isEqualTo("You are registered for Domain-Driven Design.");
        assertThat(dsl.fetchCount(REGISTRATION, REGISTRATION.WORKSHOP_ID.eq(900L)
                .and(REGISTRATION.PARTICIPANT_NAME.eq("Ada Keller"))
                .and(REGISTRATION.PARTICIPANT_EMAIL.eq(ADA))
                .and(REGISTRATION.REGISTERED_AT.isNotNull()))).isEqualTo(1);
        assertThat(row("Domain-Driven Design").freePlaces()).isEqualTo(18);
    }

    @Test
    @UseCase(id = "UC-002", businessRules = {"BR-002"})
    void registration_is_open_until_24_hours_before_the_start() {
        navigate(RegisterForWorkshopView.class);

        register(row("Spring Boot Day"), "Ada Keller", ADA);

        assertThat(test($(Notification.class).last()).getText())
                .isEqualTo("You are registered for Spring Boot Day.");
        assertThat(dsl.fetchCount(REGISTRATION, REGISTRATION.WORKSHOP_ID.eq(903L))).isEqualTo(1);
    }

    @Test
    @UseCase(id = "UC-002", scenario = "A1: Workshop Fully Booked", businessRules = {"BR-001"})
    void fully_booked_workshop_rejects_registration() {
        navigate(RegisterForWorkshopView.class);

        register(row("Testing with Testcontainers"), "Ada Keller", ADA);

        assertThat(test($(Notification.class).last()).getText()).isEqualTo("This workshop is fully booked.");
        assertThat(dsl.fetchCount(REGISTRATION, REGISTRATION.WORKSHOP_ID.eq(901L))).isEqualTo(1);
    }

    @Test
    @UseCase(id = "UC-002", scenario = "A2: Registration Closed", businessRules = {"BR-002"})
    void registration_closes_24_hours_before_the_start() {
        navigate(RegisterForWorkshopView.class);

        register(row("Kotlin Kickoff"), "Ada Keller", ADA);

        assertThat(test($(Notification.class).last()).getText())
                .isEqualTo("Registration for this workshop has closed.");
        assertThat(dsl.fetchCount(REGISTRATION, REGISTRATION.WORKSHOP_ID.eq(902L))).isZero();
    }

    @Test
    @UseCase(id = "UC-002", scenario = "A3: Already Registered", businessRules = {"BR-003"})
    void same_email_cannot_register_twice() {
        navigate(RegisterForWorkshopView.class);

        register(row("Domain-Driven Design"), "Marco Rossi", "marco.rossi@example.com");

        assertThat(test($(Notification.class).last()).getText())
                .isEqualTo("You are already registered for this workshop.");
        assertThat(dsl.fetchCount(REGISTRATION, REGISTRATION.WORKSHOP_ID.eq(900L)
                .and(REGISTRATION.PARTICIPANT_EMAIL.eq("marco.rossi@example.com")))).isEqualTo(1);
    }

    @Test
    @UseCase(id = "UC-002", businessRules = {"BR-003"})
    void same_email_can_register_for_another_workshop() {
        navigate(RegisterForWorkshopView.class);

        register(row("Spring Boot Day"), "Marco Rossi", "marco.rossi@example.com");

        assertThat(test($(Notification.class).last()).getText())
                .isEqualTo("You are registered for Spring Boot Day.");
        dsl.deleteFrom(REGISTRATION).where(REGISTRATION.WORKSHOP_ID.eq(903L)
                .and(REGISTRATION.PARTICIPANT_EMAIL.eq("marco.rossi@example.com"))).execute();
    }

    @Test
    @UseCase(id = "UC-002", requirements = {"NFR-001"})
    void name_and_email_lengths_are_limited() {
        navigate(RegisterForWorkshopView.class);
        assertThat($(TextField.class).withCaption("Name").single().getMaxLength()).isEqualTo(100);
        assertThat($(EmailField.class).withCaption("Email").single().getMaxLength()).isEqualTo(255);

        assertThatThrownBy(() -> registrationService.register(
                new RegisterParticipant(900L, "A".repeat(101), ADA)))
                .isInstanceOf(ConstraintViolationException.class);
        assertThatThrownBy(() -> registrationService.register(
                new RegisterParticipant(900L, "Ada Keller", "a".repeat(244) + "@example.com")))
                .isInstanceOf(ConstraintViolationException.class);
        assertThat(dsl.fetchCount(REGISTRATION, REGISTRATION.PARTICIPANT_EMAIL.like("%@example.com")
                .and(REGISTRATION.WORKSHOP_ID.eq(900L)))).isEqualTo(1);
    }

    private UpcomingWorkshop row(String title) {
        Grid<UpcomingWorkshop> grid = $(Grid.class).id("upcoming-workshops");
        for (int i = 0; i < test(grid).size(); i++) {
            if (test(grid).getRow(i).title().equals(title)) {
                return test(grid).getRow(i);
            }
        }
        throw new AssertionError("No upcoming workshop " + title);
    }

    private void register(UpcomingWorkshop workshop, String name, String email) {
        $(Grid.class).id("upcoming-workshops").select(workshop);
        test($(TextField.class).withCaption("Name").single()).setValue(name);
        test($(EmailField.class).withCaption("Email").single()).setValue(email);
        test($(Button.class).withText("Register").single()).click();
    }
}
