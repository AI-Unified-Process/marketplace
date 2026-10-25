package com.example.hotel.guest;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

record RegisterGuestRequest(String firstName, String lastName, String email) {
}

record ApiErrorResponse(String message) {
}

@RestController
@RequestMapping("/api/guests")
public class GuestController {

    private final GuestService service;

    public GuestController(GuestService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<?> register(@RequestBody RegisterGuestRequest request) {
        try {
            GuestDto guest = service.register(request.firstName(), request.lastName(), request.email());
            return ResponseEntity.ok(guest);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ApiErrorResponse(e.getMessage()));
        }
    }
}
