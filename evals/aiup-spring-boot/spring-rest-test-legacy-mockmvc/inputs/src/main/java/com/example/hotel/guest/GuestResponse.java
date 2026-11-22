package com.example.hotel.guest;

import java.time.LocalDate;

public record GuestResponse(Long id, String firstName, String lastName, String email, LocalDate birthDate) {

    static GuestResponse from(Guest guest) {
        return new GuestResponse(guest.id(), guest.firstName(), guest.lastName(), guest.email(), guest.birthDate());
    }
}
