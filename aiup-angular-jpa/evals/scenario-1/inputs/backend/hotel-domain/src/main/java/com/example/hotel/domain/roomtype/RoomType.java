package com.example.hotel.domain.roomtype;

import lombok.Builder;

import java.math.BigDecimal;

@Builder
public record RoomType(Long id, String name, String description, int capacity, BigDecimal price) {
}
