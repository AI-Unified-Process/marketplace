package com.example.hotel.business.roomtype.dto;

import com.example.hotel.domain.roomtype.RoomType;

import java.math.BigDecimal;

public record RoomTypeDTO(Long id, String name, String description, int capacity, BigDecimal price) {

    public static RoomTypeDTO fromBusiness(RoomType roomType) {
        return new RoomTypeDTO(roomType.id(), roomType.name(), roomType.description(),
            roomType.capacity(), roomType.price());
    }
}
