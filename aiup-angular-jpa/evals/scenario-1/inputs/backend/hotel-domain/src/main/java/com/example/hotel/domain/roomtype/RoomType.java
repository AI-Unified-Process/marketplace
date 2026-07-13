package com.example.hotel.domain.roomtype;

import java.math.BigDecimal;

public record RoomType(Long id, String name, String description, int capacity, BigDecimal price) {
}
