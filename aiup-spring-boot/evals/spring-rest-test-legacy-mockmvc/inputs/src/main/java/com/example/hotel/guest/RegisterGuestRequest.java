package com.example.hotel.guest;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record RegisterGuestRequest(
        @NotBlank @Size(max = 100) String firstName,
        @NotBlank @Size(max = 100) String lastName,
        @NotBlank @Email @Size(max = 255) String email,
        @NotNull LocalDate birthDate,
        @NotNull LocalDate arrivalDate) {

    RegisterGuest toCommand() {
        return new RegisterGuest(firstName, lastName, email, birthDate, arrivalDate);
    }
}
