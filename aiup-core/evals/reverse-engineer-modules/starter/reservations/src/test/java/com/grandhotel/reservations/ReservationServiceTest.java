package com.grandhotel.reservations;

import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.grandhotel.common.BusinessException;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class ReservationServiceTest {

    @Autowired
    ReservationService reservations;

    @Test
    void a_stay_of_more_than_28_nights_is_rejected() {
        assertThatThrownBy(() -> reservations.offers(java.time.LocalDate.now().plusDays(1),
                java.time.LocalDate.now().plusDays(31), 2))
                .isInstanceOf(BusinessException.class).hasMessageContaining("28 nights");
    }

    @Test
    void a_late_cancellation_of_a_refundable_rate_is_charged_the_first_night() {
        // arrival tomorrow, free cancellation ends 48 hours before arrival
    }

    @Test
    void check_in_needs_an_inspected_room() {
    }
}
