package com.example.hotel.guest;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.List;

@RestController
@RequestMapping("/api/v1/guests")
public class GuestController {

    private final GuestService service;

    public GuestController(GuestService service) {
        this.service = service;
    }

    /**
     * UC-002: lists the registered guests.
     */
    @GetMapping
    public List<GuestResponse> findAll() {
        return service.findAll().stream().map(GuestResponse::from).toList();
    }

    /**
     * UC-001 steps 3–5, A1, A2: registers a guest.
     */
    @PostMapping
    public ResponseEntity<GuestResponse> register(@Valid @RequestBody RegisterGuestRequest request,
                                                  UriComponentsBuilder uri) {
        Guest guest = service.register(request.toCommand());
        return ResponseEntity.created(uri.path("/api/v1/guests/{id}").buildAndExpand(guest.id()).toUri())
                .body(GuestResponse.from(guest));
    }
}
