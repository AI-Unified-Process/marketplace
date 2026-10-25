# Order Summary Data Access Layer

## Problem Description

The back-office team at a small e-commerce company needs a list view of all orders so operators can monitor activity throughout the day. Each row in the list should show the order ID, the customer's name, and the total number of line items in the order — giving operators a quick sense of complexity before opening an order for full review.

The project uses Vaadin for the front end and jOOQ for data access. The database schema is already in place. Generated jOOQ table classes for `ORDER` and `ORDER_ITEM` are available under `generated/tables/`. An existing `CustomerRepository.java` in `src/main/java/com/example/shop/order/` shows the data access patterns used in this project — read it before writing new code.

A use case specification is at `docs/use_cases/UC-020-list-orders.md` and the entity model is at `docs/entity_model.md`. The `OrderSummaryDto` record type is described in the use case spec; you will need to create it as a Java source file.

## Output Specification

Implement the data access layer for UC-020 only. Specifically, create the following files in `src/main/java/com/example/shop/order/`:

- `OrderSummaryDto.java` — the Java record used to project query results
- `OrderRepository.java` — a Spring `@Repository` class with:
  - A method that returns all orders as a list of `OrderSummaryDto`, including the item count per order, sorted by most recently created first
  - A method that fetches a single full order record by its ID

Do **not** create a Vaadin view, a service layer, or any test classes.
