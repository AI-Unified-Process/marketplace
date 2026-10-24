package com.example.hotel.guest;

import jakarta.validation.Valid;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;

import java.time.Clock;
import java.time.LocalDateTime;
import java.util.List;

@Service
@Validated
@Transactional(readOnly = true)
public class GuestService {

    private final GuestRepository repository;
    private final Clock clock;

    public GuestService(GuestRepository repository, Clock clock) {
        this.repository = repository;
        this.clock = clock;
    }

    /**
     * UC-002: the guest list.
     */
    public List<Guest> findAll() {
        return repository.findAll();
    }

    /**
     * UC-001 steps 3–5, A1, A2: registers a guest.
     */
    @Transactional
    public Guest register(@Valid RegisterGuest command) {
        // UC-001 BR-002: An email address belongs to at most one guest.
        if (repository.existsByEmail(command.email())) {
            throw new EmailAlreadyRegisteredException(command.email());
        }
        // UC-001 BR-003: A guest must be at least eighteen years old on the day of arrival.
        if (command.birthDate().plusYears(18).isAfter(command.arrivalDate())) {
            throw new GuestTooYoungException();
        }
        try {
            return repository.insert(new Guest(null, command.firstName(), command.lastName(), command.email(),
                    command.birthDate(), LocalDateTime.now(clock)));
        } catch (DuplicateKeyException e) {
            throw new EmailAlreadyRegisteredException(command.email());
        }
    }
}
