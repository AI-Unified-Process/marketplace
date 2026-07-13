package com.example.hotel.postgres.roomtype.converter;

import com.example.hotel.domain.roomtype.RoomType;
import com.example.hotel.postgres.roomtype.model.RoomTypeEntity;

public class RoomTypeEntityConverter {

    public static RoomTypeEntity toEntity(RoomType domain) {
        return new RoomTypeEntity(domain.id(), domain.name(), domain.description(),
            domain.capacity(), domain.price());
    }
}
