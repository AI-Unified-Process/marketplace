package com.example.hotel.guest;

import java.util.List;

import com.vaadin.hilla.BrowserCallable;
import com.vaadin.hilla.exception.EndpointException;

import jakarta.annotation.security.RolesAllowed;

/** UC-020 Register Guest: delegates to GuestService. */
@BrowserCallable
@RolesAllowed("FRONT_DESK")
public class GuestEndpoint {

    private final GuestService service;

    GuestEndpoint(GuestService service) {
        this.service = service;
    }

    public List<Guest> list() {
        return service.list(0, 1000);
    }

    public Guest register(GuestRegistration registration) {
        try {
            return service.register(registration);
        } catch (EmailAlreadyRegisteredException | IllegalArgumentException e) {
            throw new EndpointException(e.getMessage());
        }
    }
}
