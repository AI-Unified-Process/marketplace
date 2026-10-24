package com.example.hotel.guest;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record Guest(Long id, String firstName, String lastName, String email, LocalDate birthDate,
                    LocalDateTime registeredAt) {
}
