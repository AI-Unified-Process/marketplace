package com.example.hotel.guest;

import org.springframework.stereotype.Service;

@Service
public class GuestService {

    private final GuestRepository repository;

    public GuestService(GuestRepository repository) {
        this.repository = repository;
    }

    public GuestDto register(String firstName, String lastName, String email) {
        if (repository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email already registered: " + email);
        }
        Guest saved = repository.save(new Guest(firstName, lastName, email));
        return new GuestDto(saved.getId(), saved.getFirstName(), saved.getLastName(), saved.getEmail());
    }
}
