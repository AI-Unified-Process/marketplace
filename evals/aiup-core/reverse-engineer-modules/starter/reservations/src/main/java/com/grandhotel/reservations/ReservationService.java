package com.grandhotel.reservations;

import com.grandhotel.common.BusinessException;
import com.grandhotel.common.NotFoundException;
import com.grandhotel.guests.GuestService;
import com.grandhotel.reservations.ReservationController.Booking;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ReservationService {

    static final int MAX_NIGHTS = 28;

    private final JdbcClient jdbc;
    private final GuestService guests;
    private final ConfirmationMailer mailer;
    private final ApplicationEventPublisher events;
    private final int freeCancellationHours;

    public ReservationService(JdbcClient jdbc, GuestService guests, ConfirmationMailer mailer,
                              ApplicationEventPublisher events,
                              @Value("${pms.cancellation.free-until-hours-before-arrival}") int freeCancellationHours) {
        this.jdbc = jdbc;
        this.guests = guests;
        this.mailer = mailer;
        this.events = events;
        this.freeCancellationHours = freeCancellationHours;
    }

    public List<Offer> offers(LocalDate arrival, LocalDate departure, int adults) {
        validateStay(arrival, departure);
        return jdbc.sql("""
                        SELECT rt.name AS room_type, rp.id AS rate_plan_id, rp.name AS rate_plan,
                               rp.price_per_night, rp.refundable
                        FROM room_type rt JOIN rate_plan rp ON rp.room_type_id = rt.id
                        WHERE rt.max_guests >= ? AND rp.valid_from <= ? AND rp.valid_to >= ?
                          AND (SELECT count(*) FROM room r WHERE r.room_type_id = rt.id AND r.status <> 'OUT_OF_ORDER')
                            > (SELECT count(*) FROM reservation x JOIN rate_plan xp ON xp.id = x.rate_plan_id
                               WHERE xp.room_type_id = rt.id AND x.status IN ('BOOKED', 'CHECKED_IN')
                                 AND x.arrival < ? AND x.departure > ?)
                        ORDER BY rp.price_per_night""")
                .params(adults, arrival, departure, departure, arrival).query(Offer.class).list();
    }

    @Transactional
    public Confirmation book(String email, Booking booking) {
        validateStay(booking.arrival(), booking.departure());
        long guestId = guests.byEmail(email).id();
        boolean available = offers(booking.arrival(), booking.departure(), booking.adults()).stream()
                .anyMatch(o -> o.ratePlanId() == booking.ratePlanId());
        if (!available) {
            throw new BusinessException("SOLD_OUT", "No room of this type is available for the chosen dates");
        }
        String code = ReservationCode.next();
        jdbc.sql("""
                        INSERT INTO reservation (guest_id, rate_plan_id, code, arrival, departure, adults)
                        VALUES (?, ?, ?, ?, ?, ?)""")
                .params(guestId, booking.ratePlanId(), code, booking.arrival(), booking.departure(), booking.adults())
                .update();
        mailer.sendConfirmation(email, code);
        return new Confirmation(code, total(code));
    }

    @Transactional
    public Confirmation change(String email, String code, Booking booking) {
        ReservationView reservation = own(email, code);
        if (!reservation.status().equals("BOOKED")) {
            throw new BusinessException("NOT_CHANGEABLE", "Only booked reservations can be changed");
        }
        validateStay(booking.arrival(), booking.departure());
        jdbc.sql("UPDATE reservation SET arrival = ?, departure = ?, adults = ?, rate_plan_id = ?, "
                        + "version = version + 1 WHERE code = ? AND version = ?")
                .params(booking.arrival(), booking.departure(), booking.adults(), booking.ratePlanId(),
                        code, reservation.version()).update();
        mailer.sendConfirmation(email, code);
        return new Confirmation(code, total(code));
    }

    @Transactional
    public Cancellation cancel(String email, String code) {
        ReservationView reservation = own(email, code);
        if (!reservation.status().equals("BOOKED")) {
            throw new BusinessException("NOT_CANCELLABLE", "Only booked reservations can be cancelled");
        }
        long hoursBefore = ChronoUnit.HOURS.between(LocalDateTime.now(), reservation.arrival().atTime(15, 0));
        // non-refundable rates and late cancellations are charged the first night
        boolean fee = !reservation.refundable() || hoursBefore < freeCancellationHours;
        jdbc.sql("UPDATE reservation SET status = 'CANCELLED' WHERE code = ?").param(code).update();
        events.publishEvent(new ReservationCancelled(reservation.id(), fee ? reservation.pricePerNight() : BigDecimal.ZERO));
        return new Cancellation(code, fee ? reservation.pricePerNight() : BigDecimal.ZERO);
    }

    public List<ReservationView> of(String email) {
        return jdbc.sql(VIEW + " WHERE g.email = lower(?) ORDER BY x.arrival").param(email)
                .query(ReservationView.class).list();
    }

    ReservationView byCode(String code) {
        return jdbc.sql(VIEW + " WHERE x.code = ?").param(code).query(ReservationView.class).optional()
                .orElseThrow(() -> new NotFoundException("Reservation", code));
    }

    private ReservationView own(String email, String code) {
        ReservationView reservation = byCode(code);
        if (!reservation.email().equalsIgnoreCase(email)) {
            throw new NotFoundException("Reservation", code);
        }
        return reservation;
    }

    private void validateStay(LocalDate arrival, LocalDate departure) {
        if (!departure.isAfter(arrival)) {
            throw new BusinessException("STAY_DATES", "Departure must be after arrival");
        }
        if (ChronoUnit.DAYS.between(arrival, departure) > MAX_NIGHTS) {
            throw new BusinessException("STAY_TOO_LONG", "A stay is at most 28 nights");
        }
    }

    private BigDecimal total(String code) {
        ReservationView r = byCode(code);
        return r.pricePerNight().multiply(BigDecimal.valueOf(ChronoUnit.DAYS.between(r.arrival(), r.departure())));
    }

    static final String VIEW = """
            SELECT x.id, x.code, g.email, x.arrival, x.departure, x.adults, x.status, x.version,
                   rp.price_per_night, rp.refundable
            FROM reservation x JOIN guest g ON g.id = x.guest_id JOIN rate_plan rp ON rp.id = x.rate_plan_id""";

    public record Offer(String roomType, long ratePlanId, String ratePlan, BigDecimal pricePerNight, boolean refundable) {
    }

    public record ReservationView(long id, String code, String email, LocalDate arrival, LocalDate departure,
                                  int adults, String status, int version, BigDecimal pricePerNight,
                                  boolean refundable) {
    }

    public record Confirmation(String code, BigDecimal total) {
    }

    public record Cancellation(String code, BigDecimal fee) {
    }

    public record ReservationCancelled(long reservationId, BigDecimal fee) {
    }
}
