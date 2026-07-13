package com.example.hotel.api.roomtype;

import com.example.hotel.business.roomtype.RoomTypeService;
import com.example.hotel.business.roomtype.dto.RoomTypeDTO;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/room-types")
public class RoomTypeController {

    private final RoomTypeService service;

    public RoomTypeController(RoomTypeService service) {
        this.service = service;
    }

    @GetMapping
    public List<RoomTypeDTO> findAll() {
        return service.findAll().stream().map(RoomTypeDTO::fromBusiness).toList();
    }
}
