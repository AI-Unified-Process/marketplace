package com.example.hotel.reservation;

import java.time.LocalDate;

public record ReservationListItem(Long id, String guestLastName, String guestFirstName, String roomTypeName,
                                  LocalDate arrivalDate, LocalDate departureDate) {
}
