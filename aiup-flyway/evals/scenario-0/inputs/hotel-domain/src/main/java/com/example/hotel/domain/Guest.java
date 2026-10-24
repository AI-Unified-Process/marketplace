package com.example.hotel.domain;

import java.time.LocalDate;

public record Guest(Long id, String firstName, String lastName, String email, LocalDate birthDate, int version) {
}
