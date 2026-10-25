package com.example.workshops.registration;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ParticipantController {

    private final RegistrationService registrationService;

    public ParticipantController(RegistrationService registrationService) {
        this.registrationService = registrationService;
    }

    /** UC-003 steps 1–3. */
    // UC-003 BR-001: Only an organizer may see the participants of a workshop.
    @PreAuthorize("hasRole('ORGANIZER')")
    @GetMapping("/api/workshops/{workshopId}/participants")
    public List<Participant> participants(@PathVariable long workshopId) {
        return registrationService.findParticipants(workshopId);
    }
}
