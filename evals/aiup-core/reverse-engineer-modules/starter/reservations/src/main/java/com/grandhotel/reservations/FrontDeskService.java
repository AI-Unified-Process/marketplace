package com.grandhotel.reservations;

import com.grandhotel.common.BusinessException;
import java.time.LocalDate;
import java.util.List;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class FrontDeskService {

    private final JdbcClient jdbc;
    private final ReservationService reservations;
    private final ApplicationEventPublisher events;

    public FrontDeskService(JdbcClient jdbc, ReservationService reservations, ApplicationEventPublisher events) {
        this.jdbc = jdbc;
        this.reservations = reservations;
        this.events = events;
    }

    public List<ReservationService.ReservationView> arrivals(LocalDate date) {
        return jdbc.sql(ReservationService.VIEW + " WHERE x.arrival = ? AND x.status = 'BOOKED'").param(date)
                .query(ReservationService.ReservationView.class).list();
    }

    @Transactional
    public void checkIn(String code, List<String> roomNumbers) {
        var reservation = reservations.byCode(code);
        if (!reservation.status().equals("BOOKED")) {
            throw new BusinessException("NOT_BOOKED", "Reservation is not waiting for check-in");
        }
        if (reservation.arrival().isAfter(LocalDate.now())) {
            throw new BusinessException("TOO_EARLY", "Check-in is possible from the arrival date on");
        }
        for (String number : roomNumbers) {
            String status = jdbc.sql("SELECT status FROM room WHERE number = ?").param(number)
                    .query(String.class).single();
            // only rooms that housekeeping has inspected are handed to guests
            if (!status.equals("INSPECTED")) {
                throw new BusinessException("ROOM_NOT_READY", "Room " + number + " is not ready");
            }
            jdbc.sql("INSERT INTO reservation_room (reservation_id, room_id) "
                    + "SELECT ?, id FROM room WHERE number = ?").params(reservation.id(), number).update();
        }
        jdbc.sql("UPDATE reservation SET status = 'CHECKED_IN' WHERE id = ?").param(reservation.id()).update();
    }

    @Transactional
    public void checkOut(String code) {
        var reservation = reservations.byCode(code);
        if (!reservation.status().equals("CHECKED_IN")) {
            throw new BusinessException("NOT_CHECKED_IN", "Reservation is not checked in");
        }
        jdbc.sql("UPDATE reservation SET status = 'CHECKED_OUT' WHERE id = ?").param(reservation.id()).update();
        jdbc.sql("UPDATE room SET status = 'DIRTY' WHERE id IN "
                + "(SELECT room_id FROM reservation_room WHERE reservation_id = ?)").param(reservation.id()).update();
        // billing issues the invoice, housekeeping plans the departure cleaning
        events.publishEvent(new GuestCheckedOut(reservation.id()));
    }

    public record GuestCheckedOut(long reservationId) {
    }
}
