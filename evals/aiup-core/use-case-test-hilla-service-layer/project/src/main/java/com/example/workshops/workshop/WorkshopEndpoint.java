package com.example.workshops.workshop;

import java.util.List;

import com.vaadin.hilla.BrowserCallable;

import jakarta.annotation.security.RolesAllowed;

/** UC-001 Manage Workshops: the endpoint of the Hilla view. */
@BrowserCallable
@RolesAllowed("ORGANIZER")
public class WorkshopEndpoint {

    private final WorkshopService workshopService;

    public WorkshopEndpoint(WorkshopService workshopService) {
        this.workshopService = workshopService;
    }

    public List<Workshop> findAll() {
        return workshopService.findAll();
    }

    public Workshop save(Workshop workshop) {
        return workshopService.save(workshop);
    }
}
