package com.example.librarymgmt.view;

import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.combobox.ComboBox;
import com.vaadin.flow.component.notification.Notification;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.component.textfield.TextField;
import com.vaadin.flow.router.Route;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@Route("borrow-book")
public class BorrowBookView extends VerticalLayout {

    private final TextField borrowerName;
    private final ComboBox<String> bookSelection;
    private final Button saveButton;

    @Autowired
    public BorrowBookView() {
        borrowerName = new TextField("Borrower Name");
        borrowerName.setPlaceholder("Enter borrower name");

        bookSelection = new ComboBox<>("Book");
        bookSelection.setItems(List.of(
                "The Pragmatic Programmer",
                "Clean Code",
                "Design Patterns",
                "Refactoring",
                "Domain-Driven Design"
        ));
        bookSelection.setPlaceholder("Select a book");

        saveButton = new Button("Save", event -> {
            String name = borrowerName.getValue();
            String book = bookSelection.getValue();

            if (name == null || name.isBlank()) {
                borrowerName.setInvalid(true);
                borrowerName.setErrorMessage("Borrower name is required");
                return;
            }
            if (book == null || book.isBlank()) {
                bookSelection.setInvalid(true);
                bookSelection.setErrorMessage("Please select a book");
                return;
            }

            Notification.show("Book borrowed successfully by " + name);
        });

        add(borrowerName, bookSelection, saveButton);
    }
}
