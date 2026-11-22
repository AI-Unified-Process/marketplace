package com.example.workshops.registration;

import java.util.List;

import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.BrowserCallable;
import com.vaadin.hilla.exception.EndpointException;

/** UC-002 Register for Workshop: the endpoint of the Hilla view. */
@BrowserCallable
@AnonymousAllowed
public class RegistrationEndpoint {

    private final RegistrationService registrationService;

    public RegistrationEndpoint(RegistrationService registrationService) {
        this.registrationService = registrationService;
    }

    public List<UpcomingWorkshop> findUpcoming() {
        return registrationService.findUpcoming();
    }

    public void register(RegisterParticipant command) {
        try {
            registrationService.register(command);
        } catch (WorkshopFullyBookedException | RegistrationClosedException | AlreadyRegisteredException e) {
            throw new EndpointException(e.getMessage());
        }
    }
}
