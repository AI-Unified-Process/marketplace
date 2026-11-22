package com.example.shop.customer;

import com.example.shop.generated.tables.pojos.Customer;
import org.jooq.DSLContext;
import org.jooq.Records;
import org.springframework.stereotype.Repository;

import java.util.List;

import static com.example.shop.generated.tables.Customers.CUSTOMERS;

@Repository
public class CustomerRepository {

    private final DSLContext ctx;

    public CustomerRepository(DSLContext ctx) {
        this.ctx = ctx;
    }

    public List<CustomerSummaryDto> findAllSummaries() {
        return ctx
            .select(CUSTOMERS.ID, CUSTOMERS.NAME, CUSTOMERS.EMAIL)
            .from(CUSTOMERS)
            .orderBy(CUSTOMERS.NAME)
            .fetch(Records.mapping(CustomerSummaryDto::new));
    }

    public Customer findById(long id) {
        return ctx
            .selectFrom(CUSTOMERS)
            .where(CUSTOMERS.ID.eq(id))
            .fetchInto(Customer.class)
            .stream()
            .findFirst()
            .orElseThrow();
    }
}
