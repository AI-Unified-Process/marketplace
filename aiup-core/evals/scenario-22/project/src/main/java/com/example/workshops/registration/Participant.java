package com.example.workshops.registration;

import java.time.LocalDateTime;

public record Participant(String name, String email, LocalDateTime registeredAt) {
}
