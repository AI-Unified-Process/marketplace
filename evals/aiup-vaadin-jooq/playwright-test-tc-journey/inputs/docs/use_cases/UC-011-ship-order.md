# UC-011: Ship Order

## Main Success Scenario

1. Warehouse operator opens the Shipping page (route `shipping`).
2. The system displays a grid of open orders (status "New") with columns: Order No, Customer, Product, Quantity.
3. Warehouse operator selects the row of the order to ship.
4. Warehouse operator clicks the "Ship" button.
5. The system opens a "Confirm Shipment" dialog.
6. Warehouse operator clicks "Ship" in the dialog.
7. The system sets the order status to "Shipped", removes it from the open-orders grid, and shows the notification "Order shipped".

## A1: Cancel Shipment

1. Same as Main Success Scenario steps 1–5.
2. Warehouse operator clicks "Cancel" in the dialog.
3. The dialog closes and the order remains with status "New".

## Business Rules

### BR-020
Only orders with status "New" can be shipped.
