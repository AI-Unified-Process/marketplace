package com.example.hotel.guest.ui;

import java.time.LocalDate;

import com.example.hotel.guest.EmailAlreadyRegisteredException;
import com.example.hotel.guest.Guest;
import com.example.hotel.guest.GuestFilter;
import com.example.hotel.guest.GuestRegistration;
import com.example.hotel.guest.GuestService;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.button.ButtonVariant;
import com.vaadin.flow.component.datepicker.DatePicker;
import com.vaadin.flow.component.formlayout.FormLayout;
import com.vaadin.flow.component.grid.Grid;
import com.vaadin.flow.component.notification.Notification;
import com.vaadin.flow.component.notification.NotificationVariant;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.component.textfield.EmailField;
import com.vaadin.flow.component.textfield.TextField;
import com.vaadin.flow.data.binder.Binder;
import com.vaadin.flow.data.binder.ValidationException;
import com.vaadin.flow.data.value.ValueChangeMode;
import com.vaadin.flow.router.Menu;
import com.vaadin.flow.router.PageTitle;
import com.vaadin.flow.router.Route;

import jakarta.annotation.security.PermitAll;

/** UC-020 Register Guest, UC-021 Find Guest. */
@Route("guests")
@PageTitle("Guests")
@Menu(title = "Guests", order = 1)
@PermitAll
public class GuestsView extends VerticalLayout {

    private final GuestService service;
    private final TextField search = new TextField("Search by last name");
    private final Grid<Guest> grid = new Grid<>();
    private final TextField firstName = new TextField("First name");
    private final TextField lastName = new TextField("Last name");
    private final EmailField email = new EmailField("Email");
    private final DatePicker dateOfBirth = new DatePicker("Date of birth");
    private final Binder<GuestRegistration> binder = new Binder<>(GuestRegistration.class);

    public GuestsView(GuestService service) {
        this.service = service;

        grid.setId("guest-grid");
        grid.addColumn(Guest::firstName).setHeader("First name");
        grid.addColumn(Guest::lastName).setHeader("Last name");
        grid.addColumn(Guest::email).setHeader("Email");
        grid.setItems(query -> service.list(query.getOffset(), query.getLimit(), filter()).stream(),
                query -> service.count(filter()));
        grid.setEmptyStateText("No guests found");

        search.setValueChangeMode(ValueChangeMode.EAGER);
        search.addValueChangeListener(e -> grid.getDataProvider().refreshAll());

        binder.forField(firstName).asRequired().bind("firstName");
        binder.forField(lastName).asRequired().bind("lastName");
        binder.forField(email).asRequired().bind("email");
        // UC-020 BR-002: A guest must be at least eighteen years old on the day of registration.
        binder.forField(dateOfBirth).asRequired()
                .withValidator(date -> !date.plusYears(18).isAfter(LocalDate.now()),
                        "The guest must be at least 18 years old")
                .bind("dateOfBirth");

        Button register = new Button("Register", e -> register());
        register.addThemeVariants(ButtonVariant.PRIMARY);

        add(search, grid, new FormLayout(firstName, lastName, email, dateOfBirth), register);
    }

    private GuestFilter filter() {
        return new GuestFilter(search.getValue());
    }

    private void register() {
        try {
            service.register(binder.writeRecord());
            Notification.show("Guest saved").addThemeVariants(NotificationVariant.SUCCESS);
            firstName.clear();
            lastName.clear();
            email.clear();
            dateOfBirth.clear();
            grid.getDataProvider().refreshAll();
        } catch (ValidationException e) {
            // field errors are shown by the binder
        } catch (EmailAlreadyRegisteredException e) {
            Notification.show(e.getMessage()).addThemeVariants(NotificationVariant.ERROR);
        }
    }
}
