package com.example.hotel.guest;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record RegisterGuest(
        // UC-001 BR-001: First name, last name, email, date of birth, and arrival date are required.
        @NotBlank @Size(max = 100) String firstName,
        @NotBlank @Size(max = 100) String lastName,
        @NotBlank @Email @Size(max = 255) String email,
        @NotNull LocalDate birthDate,
        @NotNull LocalDate arrivalDate) {
}
