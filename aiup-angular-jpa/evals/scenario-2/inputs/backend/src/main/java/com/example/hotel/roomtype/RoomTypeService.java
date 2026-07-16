package com.example.hotel.roomtype;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoomTypeService {

    private final RoomTypeRepository repository;

    public RoomTypeService(RoomTypeRepository repository) {
        this.repository = repository;
    }

    public List<RoomTypeDto> findAll() {
        return repository.findAll().stream()
            .map(rt -> new RoomTypeDto(rt.getId(), rt.getName(), rt.getDescription(), rt.getCapacity(), rt.getPrice()))
            .toList();
    }
}
