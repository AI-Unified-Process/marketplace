package com.example.workshops.registration;

import java.util.List;

import com.vaadin.flow.component.grid.Grid;
import com.vaadin.flow.component.html.Span;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.router.BeforeEnterEvent;
import com.vaadin.flow.router.BeforeEnterObserver;
import com.vaadin.flow.router.PageTitle;
import com.vaadin.flow.router.Route;

import com.example.workshops.workshop.Workshop;
import com.example.workshops.workshop.WorkshopRepository;

import jakarta.annotation.security.RolesAllowed;

/** UC-003 List Participants. */
@Route("workshops/:workshopId/participants")
@PageTitle("Participants")
// UC-003 BR-001: Only an organizer may see the participants of a workshop.
@RolesAllowed("ORGANIZER")
public class ParticipantsView extends VerticalLayout implements BeforeEnterObserver {

    private final RegistrationService registrationService;
    private final WorkshopRepository workshopRepository;
    private final Grid<Participant> grid = new Grid<>(Participant.class, false);
    private final Span summary = new Span();

    public ParticipantsView(RegistrationService registrationService, WorkshopRepository workshopRepository) {
        this.registrationService = registrationService;
        this.workshopRepository = workshopRepository;
        grid.setId("participant-grid");
        grid.addColumn(Participant::name).setHeader("Name");
        grid.addColumn(Participant::email).setHeader("Email");
        grid.addColumn(Participant::registeredAt).setHeader("Registered at");
        summary.setId("participant-summary");
        add(summary, grid);
    }

    @Override
    public void beforeEnter(BeforeEnterEvent event) {
        long workshopId = Long.parseLong(event.getRouteParameters().get("workshopId").orElseThrow());
        Workshop workshop = workshopRepository.findById(workshopId).orElseThrow();
        List<Participant> participants = registrationService.findParticipants(workshopId);
        if (participants.isEmpty()) {
            summary.setText("No one has registered yet.");
        } else {
            summary.setText(count(participants.size(), "registration") + ", "
                    + count(workshop.capacity() - participants.size(), "free place"));
        }
        grid.setItems(participants);
    }

    private static String count(int n, String noun) {
        return n + " " + noun + (n == 1 ? "" : "s");
    }
}
