# Order History View

## Problem Description

The customer service team at ShopCo needs a new screen in the internal operations portal to help representatives look up a customer's order history. Currently, reps have to query the database manually, which is slow and error-prone.

The portal is built with Vaadin and jOOQ on the Java stack. The data model and use case spec have already been written by the business analyst. A similar screen — the Customer Directory view — was recently implemented and can serve as a code pattern reference. Generated jOOQ table stubs for the relevant tables are already present.

Your job is to implement the **View Order History** feature (UC-025) by adding the necessary data access layer and Vaadin view.

The use case spec is at `docs/use_cases/UC-025-view-order-history.md`. The entity model is at `docs/entity_model.md`. Existing pattern code is in `src/main/java/com/example/shop/customer/`.

The generated jOOQ classes you will need are in the `generated/` directory:
- `generated/tables/Orders.java` — the ORDERS table descriptor (field constants: `ORDERS.ID`, `ORDERS.CUSTOMER_ID`, `ORDERS.ORDER_DATE`, `ORDERS.STATUS`)
- `generated/tables/OrderItems.java` — the ORDER_ITEMS table (field constants: `ORDER_ITEMS.ID`, `ORDER_ITEMS.ORDER_ID`, etc.)
- `generated/tables/pojos/Order.java` — the generated POJO for a full order record

The package for new code should follow the existing convention: `com.example.shop.order`.

## Output Specification

Produce the following files in `src/main/java/com/example/shop/order/`:

- `OrderSummaryDto.java` — a Java record holding the projected fields for the grid rows
- `OrderRepository.java` — Spring `@Repository` with methods to query orders using jOOQ
- `OrderHistoryView.java` — Vaadin `@Route` view class wiring together the repository and UI components

Implement the data layer and view only — separate testing concerns are handled by the team's dedicated testing workflows.
