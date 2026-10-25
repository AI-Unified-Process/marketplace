package com.example.workshops.registration;

import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.grid.Grid;
import com.vaadin.flow.component.notification.Notification;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.component.textfield.EmailField;
import com.vaadin.flow.component.textfield.TextField;
import com.vaadin.flow.router.PageTitle;
import com.vaadin.flow.router.Route;
import com.vaadin.flow.server.auth.AnonymousAllowed;

/** UC-002 Register for Workshop. */
@Route("register")
@PageTitle("Register for a Workshop")
@AnonymousAllowed
public class RegisterForWorkshopView extends VerticalLayout {

    private final RegistrationService registrationService;
    private final Grid<UpcomingWorkshop> grid = new Grid<>(UpcomingWorkshop.class, false);
    private final TextField name = new TextField("Name");
    private final EmailField email = new EmailField("Email");

    public RegisterForWorkshopView(RegistrationService registrationService) {
        this.registrationService = registrationService;
        grid.setId("upcoming-workshops");
        grid.addColumn(UpcomingWorkshop::title).setHeader("Title");
        grid.addColumn(UpcomingWorkshop::startsAt).setHeader("Start");
        grid.addColumn(UpcomingWorkshop::freePlaces).setHeader("Free places");
        name.setMaxLength(100);
        email.setMaxLength(255);
        add(grid, name, email, new Button("Register", e -> register()));
        grid.setItems(registrationService.findUpcoming());
    }

    private void register() {
        UpcomingWorkshop workshop = grid.asSingleSelect().getValue();
        if (workshop == null) {
            return;
        }
        try {
            RegistrationResult result = registrationService.register(
                    new RegisterParticipant(workshop.id(), name.getValue(), email.getValue()));
            if (result == RegistrationResult.WAITLISTED) {
                Notification.show("This workshop is fully booked. You are on the waiting list.");
            } else {
                Notification.show("You are registered for " + workshop.title() + ".");
            }
            grid.setItems(registrationService.findUpcoming());
        } catch (RegistrationClosedException | AlreadyRegisteredException e) {
            Notification.show(e.getMessage());
        }
    }
}
