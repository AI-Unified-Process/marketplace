package com.example.hotel.postgres.roomtype.converter;

import com.example.hotel.domain.roomtype.RoomType;
import com.example.hotel.postgres.roomtype.model.RoomTypeEntity;

public class RoomTypeEntityConverter {

    public static RoomTypeEntity toEntity(RoomType domain) {
        return RoomTypeEntity.builder()
            .id(domain.id())
            .name(domain.name())
            .description(domain.description())
            .capacity(domain.capacity())
            .price(domain.price())
            .build();
    }
}
