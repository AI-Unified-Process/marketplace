package com.example.shop.order;

import org.jooq.DSLContext;
import org.jooq.Records;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

import static com.example.shop.generated.tables.Tables.ORDER;

/**
 * Example repository showing jOOQ patterns used in this project.
 * Use this as a reference for new data access implementations.
 */
@Repository
public class CustomerRepository {

    private final DSLContext ctx;

    public CustomerRepository(DSLContext ctx) {
        this.ctx = ctx;
    }

    // Example of a projected query using Records.mapping():
    // Note how SELECT column order must match CustomerSummaryDto constructor parameter order.
    public List<CustomerSummaryDto> findAllSummaries() {
        return ctx
                .select(ORDER.ID, ORDER.CUSTOMER_NAME)
                .from(ORDER)
                .orderBy(ORDER.CUSTOMER_NAME.asc())
                .fetch(Records.mapping(CustomerSummaryDto::new));
    }

    // Example of a full-row fetch using fetchInto() with the generated POJO (no projection):
    public Optional<com.example.shop.generated.tables.pojos.Order> findById(Long id) {
        return ctx
                .selectFrom(ORDER)
                .where(ORDER.ID.eq(id))
                .fetchOptionalInto(com.example.shop.generated.tables.pojos.Order.class);
    }
}
