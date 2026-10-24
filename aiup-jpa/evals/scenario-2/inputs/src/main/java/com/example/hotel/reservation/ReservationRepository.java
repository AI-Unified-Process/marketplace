package com.example.hotel.reservation;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    // UC-031 BR-001: Cancelled reservations never appear in the search result.
    @Query("""
            select new com.example.hotel.reservation.ReservationListItem(
                r.id, g.lastName, g.firstName, rt.name, r.arrivalDate, r.departureDate)
            from Reservation r
            join r.guest g
            join r.roomType rt
            where r.arrivalDate between :from and :to
              and r.status <> com.example.hotel.reservation.ReservationStatus.CANCELLED
            order by r.arrivalDate, g.lastName
            """)
    List<ReservationListItem> findArrivals(LocalDate from, LocalDate to);
}
