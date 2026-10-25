package com.example.workshops.registration;

import static com.example.workshops.db.tables.Registration.REGISTRATION;
import static com.example.workshops.db.tables.WaitingListEntry.WAITING_LIST_ENTRY;
import static org.assertj.core.api.Assertions.assertThat;

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

@SpringBootTest(classes = {TestcontainersConfiguration.class, UC002RegisterForWorkshopTest.FixedClock.class})
class UC002RegisterForWorkshopTest extends SpringBrowserlessTest {

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

    @AfterEach
    void removeCreatedRows() {
        dsl.deleteFrom(REGISTRATION).where(REGISTRATION.PARTICIPANT_EMAIL.eq("ada.keller@example.com")).execute();
        dsl.deleteFrom(WAITING_LIST_ENTRY).where(WAITING_LIST_ENTRY.PARTICIPANT_EMAIL.eq("ada.keller@example.com")).execute();
    }

    @Test
    @UseCase(id = "UC-002", businessRules = {"BR-001"})
    void participant_registers_for_workshop_with_free_places() {
        navigate(RegisterForWorkshopView.class);
        Grid<UpcomingWorkshop> grid = $(Grid.class).id("upcoming-workshops");
        UpcomingWorkshop ddd = test(grid).getRow(0);
        assertThat(ddd.title()).isEqualTo("Domain-Driven Design");
        assertThat(ddd.freePlaces()).isEqualTo(19);

        grid.select(ddd);
        test($(TextField.class).withCaption("Name").single()).setValue("Ada Keller");
        test($(EmailField.class).withCaption("Email").single()).setValue("ada.keller@example.com");
        test($(Button.class).withText("Register").single()).click();

        assertThat(test($(Notification.class).last()).getText())
                .isEqualTo("You are registered for Domain-Driven Design.");
        assertThat(dsl.fetchCount(REGISTRATION, REGISTRATION.WORKSHOP_ID.eq(900L)
                .and(REGISTRATION.PARTICIPANT_EMAIL.eq("ada.keller@example.com")))).isEqualTo(1);
        assertThat(test(grid).getRow(0).freePlaces()).isEqualTo(18);
    }

    @Test
    @UseCase(id = "UC-002", scenario = "A1: Workshop Fully Booked", businessRules = {"BR-001"})
    void fully_booked_workshop_puts_participant_on_waiting_list() {
        navigate(RegisterForWorkshopView.class);
        Grid<UpcomingWorkshop> grid = $(Grid.class).id("upcoming-workshops");
        grid.select(test(grid).getRow(1));
        test($(TextField.class).withCaption("Name").single()).setValue("Ada Keller");
        test($(EmailField.class).withCaption("Email").single()).setValue("ada.keller@example.com");
        test($(Button.class).withText("Register").single()).click();

        assertThat(test($(Notification.class).last()).getText())
                .isEqualTo("This workshop is fully booked. You are on the waiting list.");
        assertThat(dsl.fetchCount(REGISTRATION, REGISTRATION.WORKSHOP_ID.eq(901L))).isEqualTo(1);
        assertThat(dsl.fetchCount(WAITING_LIST_ENTRY, WAITING_LIST_ENTRY.WORKSHOP_ID.eq(901L))).isEqualTo(1);
    }

    @Test
    @UseCase(id = "UC-002", scenario = "A3: Already Registered", businessRules = {"BR-003"})
    void same_email_cannot_register_twice() {
        navigate(RegisterForWorkshopView.class);
        Grid<UpcomingWorkshop> grid = $(Grid.class).id("upcoming-workshops");
        grid.select(test(grid).getRow(0));
        test($(TextField.class).withCaption("Name").single()).setValue("Marco Rossi");
        test($(EmailField.class).withCaption("Email").single()).setValue("marco.rossi@example.com");
        test($(Button.class).withText("Register").single()).click();

        assertThat(test($(Notification.class).last()).getText())
                .isEqualTo("You are already registered for this workshop.");
        assertThat(dsl.fetchCount(REGISTRATION, REGISTRATION.WORKSHOP_ID.eq(900L)
                .and(REGISTRATION.PARTICIPANT_EMAIL.eq("marco.rossi@example.com")))).isEqualTo(1);
    }
}
