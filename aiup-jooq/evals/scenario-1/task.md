# Build the Persistence Layer of "Confirm Order" (UC-020)

## Problem Description

An online shop combines Flyway, jOOQ, Spring Boot services, and a Spring REST API. The `purchase_order` and
`order_line` tables exist (`V002__create_order_tables.sql`), and jOOQ generates classes into `com.example.shop.db`.
There are no repositories yet.

The use case is `docs/use_cases/UC-020-confirm-order.md`; the entity model is `docs/entity_model.md`.

## Output Specification

Run the persistence layer skill for UC-020 directly (as `/jooq-persistence UC-020` would): the repository methods and
record types the service needs to show an order with its lines and to confirm it. End with the Handover block and the
hand-off line.

Do not write services, controllers, migrations, or tests.
