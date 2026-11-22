package com.example.hotel.guest;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;

import jakarta.validation.Valid;

/** UC-020 Register Guest. */
@Service
@Validated
public class GuestService {

    private final GuestRepository repository;

    GuestService(GuestRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<Guest> list(int offset, int limit) {
        return repository.findAll(offset, limit);
    }

    @Transactional(readOnly = true)
    public int count() {
        return repository.count();
    }

    @Transactional
    public Guest register(@Valid GuestRegistration registration) {
        // UC-020 BR-002: A guest must be at least eighteen years old on the day of registration.
        if (registration.dateOfBirth().plusYears(18).isAfter(LocalDate.now())) {
            throw new IllegalArgumentException("The guest must be at least 18 years old");
        }
        // UC-020 BR-001: No two guests may share the same email address.
        if (repository.existsByEmail(registration.email())) {
            throw new EmailAlreadyRegisteredException(registration.email());
        }
        return repository.insert(registration);
    }
}
