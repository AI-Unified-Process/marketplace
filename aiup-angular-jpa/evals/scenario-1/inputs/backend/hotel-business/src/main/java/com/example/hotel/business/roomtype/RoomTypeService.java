package com.example.hotel.business.roomtype;

import com.example.hotel.domain.roomtype.RoomType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RoomTypeService {

    private final RoomTypeRepository repository;

    public List<RoomType> findAll() {
        return repository.findAll();
    }

    public RoomType create(RoomType roomType) {
        return repository.save(roomType);
    }
}
