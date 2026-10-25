# Requirements Catalog — ShopStream Checkout

## Functional Requirements

| ID     | Requirement                                                                                                                           | Status   |
|--------|---------------------------------------------------------------------------------------------------------------------------------------|----------|
| FR-001 | As a Customer, I want to review items in my cart so that I can confirm what I am purchasing before paying.                            | Approved |
| FR-002 | As a Customer, I want to enter or select a shipping address so that my order can be delivered to the correct location.                | Approved |
| FR-003 | As a Customer, I want to choose a shipping method so that I can balance delivery speed against cost.                                  | Approved |
| FR-004 | As a Customer, I want to enter payment details so that I can complete my purchase.                                                    | Approved |
| FR-005 | As a Customer, I want to receive an order confirmation so that I know my purchase was successful.                                     | Approved |
| FR-006 | As a Customer, I want to be notified when a payment is declined so that I can try a different payment method.                         | Approved |
| FR-007 | As a Customer, I want to be alerted when an item in my cart goes out of stock during checkout so that I can adjust my order.          | Approved |
| FR-008 | As a Customer, I want to apply a promo code to my order so that I can receive applicable discounts.                                   | Approved |
| FR-009 | As a Customer, I want to review the full order summary (items, shipping, taxes, discounts, total) before placing my order.            | Approved |
| FR-010 | As a Customer, I want to cancel the checkout at any point before confirming so that I can return to shopping.                         | Approved |

## Non-Functional Requirements

| ID      | Requirement                                                                                        | Status   |
|---------|----------------------------------------------------------------------------------------------------|----------|
| NFR-001 | The checkout pages must load within 2 seconds under normal traffic.                               | Approved |
| NFR-002 | Payment data must be transmitted using TLS 1.2 or higher at all times.                           | Approved |
| NFR-003 | The system must process at least 500 concurrent checkout sessions without degradation.            | Approved |

## Constraints

| ID    | Constraint                                                                                          | Status   |
|-------|-----------------------------------------------------------------------------------------------------|----------|
| C-001 | Payment processing must integrate with the company's approved payment gateway only.                | Approved |
| C-002 | Promo codes may not be combined; only one code may be applied per order.                           | Approved |
| C-003 | Checkout must be completed within 30 minutes of the session starting or the cart is released.      | Approved |
