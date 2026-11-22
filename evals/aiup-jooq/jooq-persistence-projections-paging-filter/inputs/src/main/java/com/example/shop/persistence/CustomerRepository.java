package com.example.shop.persistence;

import java.util.Optional;

import org.jooq.DSLContext;
import org.jooq.Records;
import org.springframework.stereotype.Repository;

import static com.example.shop.db.Tables.CUSTOMER;

@Repository
public class CustomerRepository {

    private final DSLContext ctx;

    public CustomerRepository(DSLContext ctx) {
        this.ctx = ctx;
    }

    public Optional<CustomerSummary> findById(long id) {
        return ctx.select(CUSTOMER.ID, CUSTOMER.NAME, CUSTOMER.EMAIL)
                .from(CUSTOMER)
                .where(CUSTOMER.ID.eq(id))
                .fetchOptional(Records.mapping(CustomerSummary::new));
    }
}
