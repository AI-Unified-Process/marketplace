package com.example.hotel.guest;

import com.vaadin.hilla.BrowserCallable;
import jakarta.annotation.security.PermitAll;

/**
 * UC-001 Register Guest: the Hilla view's entry point; delegates to {@link GuestService}.
 */
@BrowserCallable
@PermitAll
public class GuestEndpoint {

    private final GuestService service;

    public GuestEndpoint(GuestService service) {
        this.service = service;
    }

    public Guest register(RegisterGuest command) {
        return service.register(command);
    }
}
