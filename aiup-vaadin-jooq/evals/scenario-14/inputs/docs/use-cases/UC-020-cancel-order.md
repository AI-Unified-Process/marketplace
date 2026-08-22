# UC-020: Cancel Order

**Status:** Implemented

**Actor:** Customer

**Realizes:** FR-031

## Preconditions

- The customer is signed in.
- The customer has at least one order in status `PLACED`.

## Main Success Scenario

1. The customer opens the order list.
2. The system displays the customer's orders with their status.
3. The customer selects an order in status `PLACED` and chooses "Cancel order".
4. The system asks the customer to confirm the cancellation.
5. The customer confirms.
6. The system sets the order status to `CANCELLED` and records the cancellation timestamp.
7. The system shows the confirmation "Order cancelled".

## Alternative Flows

### A1: Customer aborts the confirmation

- At step 5 the customer dismisses the confirmation dialog.
- The order keeps its status `PLACED`.
- The use case ends.

### A2: Order already shipped

- At step 3 the selected order has status `SHIPPED`.
- The system shows "Shipped orders cannot be cancelled" and leaves the order unchanged.
- The use case ends.

## Business Rules

### BR-001: Cancellation window

An order may only be cancelled within 24 hours of being placed. After that the cancel action is
rejected with "The cancellation window has expired".

### BR-002: Only own orders

A customer may only cancel orders they placed themselves.

## Postconditions

### Success Postconditions

- The order has status `CANCELLED`.
- The cancellation timestamp is stored on the order.

### Failure Postconditions

- The order retains the status it had before the attempt.
