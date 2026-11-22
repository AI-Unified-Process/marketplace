# UC-010: Create Order

## Main Success Scenario

1. Clerk opens the Orders page (route `orders`).
2. The system displays a grid of existing orders with columns: Order No, Customer, Product, Quantity, Status.
3. Clerk clicks the "New Order" button.
4. The system opens a "New Order" dialog with fields: Customer (combo box), Product (combo box), Quantity (text field).
5. Clerk selects a customer and a product, enters a quantity, and clicks "Place Order".
6. The system saves the order with status "New", closes the dialog, refreshes the grid, and shows the notification "Order placed".

## A1: Validation Error on Missing Fields

1. Same as Main Success Scenario steps 1–4.
2. Clerk clicks "Place Order" without selecting a customer.
3. The system marks the Customer field as invalid and the dialog remains open.

## Business Rules

### BR-010
Customer, Product, and Quantity are required.

### BR-011
A newly created order always has status "New".
