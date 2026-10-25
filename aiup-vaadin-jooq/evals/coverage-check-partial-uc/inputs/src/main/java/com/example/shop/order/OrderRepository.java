package com.example.shop.order;

import static com.example.shop.db.tables.Orders.ORDERS;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.jooq.DSLContext;
import org.jooq.Records;
import org.springframework.stereotype.Repository;

@Repository
public class OrderRepository {

    private final DSLContext ctx;

    public OrderRepository(DSLContext ctx) {
        this.ctx = ctx;
    }

    /** BR-002: only the customer's own orders are ever returned to the view. */
    public List<OrderDto> findByCustomer(Long customerId) {
        return ctx.select(ORDERS.ID, ORDERS.CUSTOMER_ID, ORDERS.STATUS, ORDERS.PLACED_AT, ORDERS.CANCELLED_AT)
                .from(ORDERS)
                .where(ORDERS.CUSTOMER_ID.eq(customerId))
                .orderBy(ORDERS.PLACED_AT.desc())
                .fetch(Records.mapping(OrderDto::new));
    }

    public Optional<OrderDto> findById(Long id) {
        return ctx.select(ORDERS.ID, ORDERS.CUSTOMER_ID, ORDERS.STATUS, ORDERS.PLACED_AT, ORDERS.CANCELLED_AT)
                .from(ORDERS)
                .where(ORDERS.ID.eq(id))
                .fetchOptional(Records.mapping(OrderDto::new));
    }

    public void cancel(Long orderId) {
        ctx.update(ORDERS)
                .set(ORDERS.STATUS, OrderStatus.CANCELLED.name())
                .set(ORDERS.CANCELLED_AT, LocalDateTime.now())
                .where(ORDERS.ID.eq(orderId))
                .execute();
    }
}
