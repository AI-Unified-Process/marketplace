package com.example.hotel.business.roomtype;

import com.example.hotel.domain.roomtype.RoomType;

import java.util.List;

public interface RoomTypeRepository {
    List<RoomType> findAll();

    RoomType save(RoomType roomType);
}
