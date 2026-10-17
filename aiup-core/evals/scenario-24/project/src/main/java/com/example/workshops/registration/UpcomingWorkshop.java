package com.example.workshops.registration;

import java.time.LocalDateTime;

public record UpcomingWorkshop(long id, String title, LocalDateTime startsAt, int capacity, int freePlaces) {
}
