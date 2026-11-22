package com.example.workshops.workshop;

import com.vaadin.flow.component.UI;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.datetimepicker.DateTimePicker;
import com.vaadin.flow.component.grid.Grid;
import com.vaadin.flow.component.notification.Notification;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.component.textfield.IntegerField;
import com.vaadin.flow.component.textfield.TextField;
import com.vaadin.flow.router.PageTitle;
import com.vaadin.flow.router.Route;
import com.vaadin.flow.router.RouteParameters;

import com.example.workshops.registration.ParticipantsView;

import jakarta.annotation.security.RolesAllowed;

/** UC-001 Manage Workshops. */
@Route("workshops")
@PageTitle("Workshops")
@RolesAllowed("ORGANIZER")
public class WorkshopView extends VerticalLayout {

    private final WorkshopService workshopService;
    private final Grid<Workshop> grid = new Grid<>(Workshop.class, false);
    private final TextField title = new TextField("Title");
    private final DateTimePicker startsAt = new DateTimePicker("Start");
    private final IntegerField capacity = new IntegerField("Capacity");
    private Long editedId;

    public WorkshopView(WorkshopService workshopService) {
        this.workshopService = workshopService;
        grid.setId("workshop-grid");
        grid.addColumn(Workshop::title).setHeader("Title");
        grid.addColumn(Workshop::startsAt).setHeader("Start");
        grid.addColumn(Workshop::capacity).setHeader("Capacity");
        grid.asSingleSelect().addValueChangeListener(e -> edit(e.getValue()));
        add(grid, title, startsAt, capacity, new Button("Save", e -> save()),
                new Button("Participants", e -> showParticipants()));
        refresh();
    }

    private void edit(Workshop workshop) {
        editedId = workshop == null ? null : workshop.id();
        if (workshop != null) {
            title.setValue(workshop.title());
            startsAt.setValue(workshop.startsAt());
            capacity.setValue(workshop.capacity());
        }
    }

    private void save() {
        try {
            workshopService.save(new Workshop(editedId, title.getValue(), startsAt.getValue(), capacity.getValue()));
            Notification.show("Workshop saved");
            refresh();
        } catch (WorkshopInPastException e) {
            Notification.show(e.getMessage());
        }
    }

    /** UC-003 step 1: the organizer selects a workshop in the workshop list. */
    private void showParticipants() {
        if (editedId != null) {
            UI.getCurrent().navigate(ParticipantsView.class,
                    new RouteParameters("workshopId", String.valueOf(editedId)));
        }
    }

    private void refresh() {
        grid.setItems(workshopService.findAll());
    }
}
