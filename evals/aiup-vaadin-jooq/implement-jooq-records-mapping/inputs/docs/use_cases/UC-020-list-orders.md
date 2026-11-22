# UC-020: List Orders with Item Summary

## Description

A back-office operator needs to see a paginated list of all orders placed in the system. For each order, the operator wants to see the order ID, customer name, and how many line items the order contains (total item count), so they can quickly assess order complexity at a glance before drilling into details.

## Actors

- Back-office Operator

## Preconditions

- The operator is authenticated and has back-office access.

## Main Success Scenario

1. The operator navigates to the Orders section of the application.
2. The system retrieves all orders along with a count of their line items.
3. The system displays the order list with columns: Order ID, Customer Name, Item Count.
4. The operator selects an order to view its full details.
5. The system retrieves the full order record by ID and displays all fields.

## Business Rules

### BR-001
Item Count must reflect the actual number of `OrderItem` rows associated with the order.

### BR-002
Orders must be sorted by `created_at` descending (most recent first).

## Data

### OrderSummaryDto
Projects: `order.id`, `order.customer_name`, count of `order_item` rows for that order.

Constructor signature (in this order):
```java
public record OrderSummaryDto(Long id, String customerName, Integer itemCount) {}
```
