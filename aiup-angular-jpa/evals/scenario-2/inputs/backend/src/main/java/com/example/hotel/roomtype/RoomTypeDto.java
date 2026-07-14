package com.example.hotel.roomtype;

import java.math.BigDecimal;

public record RoomTypeDto(Long id, String name, String description, int capacity, BigDecimal price) {
}
