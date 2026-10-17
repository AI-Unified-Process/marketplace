package com.example.hotel.postgres.roomtype.converter;

import com.example.hotel.domain.roomtype.RoomType;
import com.example.hotel.postgres.roomtype.model.RoomTypeEntity;

public class RoomTypeConverter {

    public static RoomType toDomain(RoomTypeEntity entity) {
        return new RoomType(entity.getId(), entity.getName(), entity.getDescription(),
            entity.getCapacity(), entity.getPrice());
    }
}
