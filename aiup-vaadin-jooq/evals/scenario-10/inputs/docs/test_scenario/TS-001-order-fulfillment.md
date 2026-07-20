# Test Scenario: Order Fulfillment

## Overview

**ID:** TS-001   
**Goal:** A clerk creates a new order and a warehouse operator ships it — verifying the order lifecycle from creation to shipment end-to-end.   
**Status:** Approved

## Roles

- Clerk (creates orders)
- Warehouse Operator (ships orders)

## Preconditions

- Customer "Acme Corp" exists (Flyway test data `V900__test_data.sql`)
- Product "Widget" exists with sufficient stock (Flyway test data `V900__test_data.sql`)

## Flow

| Step | Name                | Description                                                              | Test Data                  | Use Case                                       |
|------|---------------------|--------------------------------------------------------------------------|----------------------------|------------------------------------------------|
| 1    | Create order        | The clerk creates a new order for a customer with a product and quantity | Acme Corp, Widget, 5       | [UC-010](../use_cases/UC-010-create-order.md)  |
| 2    | Verify order listed | The new order appears in the orders grid with status "New"               | -                          | -                                              |
| 3    | Ship order          | The warehouse operator ships the open order                              | -                          | [UC-011](../use_cases/UC-011-ship-order.md)    |
| 4    | Verify shipment     | A shipment confirmation notification is shown                            | -                          | -                                              |

## Validation

1. **Order count**: After the scenario, the orders grid contains exactly one more order than before the scenario started.
2. **Final status**: The order created in step 1 has status "Shipped" in the orders grid.
