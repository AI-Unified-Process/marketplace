package com.example.workshops.registration;

import java.time.Clock;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;

import com.example.workshops.workshop.Workshop;
import com.example.workshops.workshop.WorkshopRepository;

import jakarta.validation.Valid;

@Service
@Validated
public class RegistrationService {

    private final WorkshopRepository workshopRepository;
    private final RegistrationRepository registrationRepository;
    private final Clock clock;

    public RegistrationService(WorkshopRepository workshopRepository, RegistrationRepository registrationRepository,
                               Clock clock) {
        this.workshopRepository = workshopRepository;
        this.registrationRepository = registrationRepository;
        this.clock = clock;
    }

    /** UC-002 steps 1–2: the upcoming workshops with their free places. */
    @Transactional(readOnly = true)
    public List<UpcomingWorkshop> findUpcoming() {
        return registrationRepository.findUpcoming(LocalDateTime.now(clock));
    }

    /** UC-002 steps 3–5, A1, A2, A3: registers a participant for a workshop. */
    @Transactional
    public void register(@Valid RegisterParticipant command) {
        Workshop workshop = workshopRepository.findById(command.workshopId()).orElseThrow();
        LocalDateTime now = LocalDateTime.now(clock);

        // UC-002 BR-002: Registration closes 24 hours before the workshop starts.
        if (now.isAfter(workshop.startsAt().minusHours(24))) {
            throw new RegistrationClosedException();
        }
        // UC-002 BR-003: A participant email can be registered only once for the same workshop.
        if (registrationRepository.existsByWorkshopAndEmail(workshop.id(), command.email())) {
            throw new AlreadyRegisteredException();
        }
        // UC-002 BR-001: Registrations only while their number is less than the capacity.
        if (registrationRepository.countByWorkshop(workshop.id()) >= workshop.capacity()) {
            throw new WorkshopFullyBookedException();
        }
        registrationRepository.insert(workshop.id(), command.name(), command.email(), now);
    }
}
