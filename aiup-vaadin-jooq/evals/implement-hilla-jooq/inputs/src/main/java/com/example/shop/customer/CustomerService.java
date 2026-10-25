package com.example.shop.customer;

import com.example.shop.generated.tables.pojos.Customer;
import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.BrowserCallable;

import java.util.List;

@BrowserCallable
@AnonymousAllowed
public class CustomerService {

    private final CustomerRepository repository;

    public CustomerService(CustomerRepository repository) {
        this.repository = repository;
    }

    public List<CustomerSummaryDto> findAllSummaries() {
        return repository.findAllSummaries();
    }

    public Customer findById(long id) {
        return repository.findById(id);
    }
}
