package com.example.shop.customer;

import com.vaadin.flow.component.grid.Grid;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.router.Route;
import org.springframework.beans.factory.annotation.Autowired;

@Route("customers")
public class CustomerView extends VerticalLayout {

    private final CustomerRepository customerRepository;
    private final Grid<CustomerSummaryDto> grid = new Grid<>(CustomerSummaryDto.class, false);

    @Autowired
    public CustomerView(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;

        grid.addColumn(CustomerSummaryDto::id).setHeader("ID");
        grid.addColumn(CustomerSummaryDto::name).setHeader("Name");
        grid.addColumn(CustomerSummaryDto::email).setHeader("Email");

        add(grid);
        grid.setItems(customerRepository.findAllSummaries());
    }
}
