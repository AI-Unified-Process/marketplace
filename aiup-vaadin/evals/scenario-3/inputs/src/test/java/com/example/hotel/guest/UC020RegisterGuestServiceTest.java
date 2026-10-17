package com.example.hotel.guest;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import com.example.hotel.TestcontainersConfiguration;
import com.example.hotel.usecase.UseCase;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/** Service tests for UC-020 "Register Guest" — the integration layer of this project. */
@SpringBootTest
@Import(TestcontainersConfiguration.class)
class UC020RegisterGuestServiceTest {

    @Autowired
    private GuestService guestService;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private final List<Long> createdIds = new ArrayList<>();

    @AfterEach
    void removeCreatedGuests() {
        createdIds.forEach(id -> jdbcTemplate.update("delete from guest where id = ?", id));
        createdIds.clear();
    }

    @Test
    @UseCase(id = "UC-020")
    void registers_a_guest() {
        Guest guest = register("jane.doe@example.com", LocalDate.of(1992, 5, 17));

        assertThat(guestService.list(0, 100)).extracting(Guest::email).contains("jane.doe@example.com");
        assertThat(guest.firstName()).isEqualTo("Jane");
    }

    @Test
    @UseCase(id = "UC-020", scenario = "A1: Email Already Registered", businessRules = {"BR-001"})
    void rejects_an_email_that_is_already_registered() {
        // anna.berger@example.com is registered by the test data migration V900__guest_test_data.sql
        assertThatThrownBy(() -> register("anna.berger@example.com", LocalDate.of(1970, 1, 1)))
                .isInstanceOf(EmailAlreadyRegisteredException.class)
                .hasMessage("Email already registered");
    }

    @Test
    @UseCase(id = "UC-020", businessRules = {"BR-002"})
    void accepts_a_guest_who_turns_eighteen_today() {
        Guest guest = register("eighteen@example.com", LocalDate.now().minusYears(18));

        assertThat(guest.id()).isPositive();
    }

    @Test
    @UseCase(id = "UC-020", scenario = "A2: Guest Too Young", businessRules = {"BR-002"})
    void rejects_a_guest_who_turns_eighteen_tomorrow() {
        assertThatThrownBy(() -> register("too.young@example.com", LocalDate.now().minusYears(18).plusDays(1)))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("The guest must be at least 18 years old");
    }

    private Guest register(String email, LocalDate dateOfBirth) {
        Guest guest = guestService.register(new GuestRegistration("Jane", "Doe", email, dateOfBirth));
        createdIds.add(guest.id());
        return guest;
    }
}
