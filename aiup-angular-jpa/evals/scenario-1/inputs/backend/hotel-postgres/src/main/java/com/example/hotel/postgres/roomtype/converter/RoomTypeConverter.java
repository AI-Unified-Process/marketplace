package com.example.hotel.postgres.roomtype.converter;

import com.example.hotel.domain.roomtype.RoomType;
import com.example.hotel.postgres.roomtype.model.RoomTypeEntity;

public class RoomTypeConverter {

    public static RoomType toDomain(RoomTypeEntity entity) {
        return RoomType.builder()
            .id(entity.getId())
            .name(entity.getName())
            .description(entity.getDescription())
            .capacity(entity.getCapacity())
            .price(entity.getPrice())
            .build();
    }
}
