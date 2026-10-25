package com.example.workshops.workshop;

import java.time.LocalDateTime;

public record Workshop(Long id, String title, LocalDateTime startsAt, int capacity) {
}
