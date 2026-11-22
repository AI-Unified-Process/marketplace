# UC-025: View Order History

## Summary

A customer service representative can view the order history for a selected customer, browsing a grid of past orders and inspecting the full details of any individual order.

## Actors

- Customer Service Representative

## Preconditions

- The representative is logged in.
- At least one customer exists in the system.

## Main Success Scenario

1. The representative navigates to the Order History screen.
2. The system displays a search field for selecting a customer.
3. The representative selects a customer.
4. The system loads and displays a grid showing all orders for that customer. Each row shows:
   - Order ID
   - Order date
   - Order status
   - Item count (number of line items in the order)
5. The representative clicks a row in the grid.
6. The system displays the full details of the selected order in a side panel.

## Business Rules

### BR-001: Order Grid Columns

The grid must show exactly: Order ID, Order date, Order status, and Item count (aggregated count of order_items rows).

### BR-002: Side Panel Detail

Clicking a grid row loads the complete order record and displays it in a side panel alongside the grid.

## Alternative Scenarios

### A1: No Orders Found

If the selected customer has no orders, the grid shows an empty state message: "No orders found for this customer."

## Post-conditions

- No data is modified.
