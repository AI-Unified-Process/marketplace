package com.example.workshops.registration;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/** REST API of UC-002 Register for Workshop for the partner portal. */
@RestController
@RequestMapping("/api/workshops")
public class RegistrationController {

    public record RegistrationRequest(String name, String email) {
    }

    private final RegistrationService registrationService;

    public RegistrationController(RegistrationService registrationService) {
        this.registrationService = registrationService;
    }

    /** UC-002 steps 1–2. */
    @GetMapping("/upcoming")
    public List<UpcomingWorkshop> upcoming() {
        return registrationService.findUpcoming();
    }

    /** UC-002 steps 3–5. */
    @PostMapping("/{workshopId}/registrations")
    @ResponseStatus(HttpStatus.CREATED)
    public void register(@PathVariable long workshopId, @RequestBody RegistrationRequest request) {
        registrationService.register(new RegisterParticipant(workshopId, request.name(), request.email()));
    }

    /** UC-002 A1, A2, A3. */
    @ExceptionHandler({WorkshopFullyBookedException.class, RegistrationClosedException.class,
            AlreadyRegisteredException.class})
    public ProblemDetail rejected(RuntimeException e) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.CONFLICT, e.getMessage());
    }
}
