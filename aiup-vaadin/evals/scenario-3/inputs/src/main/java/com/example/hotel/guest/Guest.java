package com.example.hotel.guest;

import java.time.LocalDate;

/** A registered guest as the service returns it. */
public record Guest(long id, String firstName, String lastName, String email, LocalDate dateOfBirth) {
}
