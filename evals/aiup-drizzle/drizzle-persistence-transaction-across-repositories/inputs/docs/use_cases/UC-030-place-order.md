# Use Case: Place Order

## Overview

**Use Case ID:** UC-030  
**Use Case Name:** Place Order  
**Primary Actor:** Customer  
**Goal:** Order several products at once so that they are delivered together  
**Trigger:** The customer submits the cart  
**Status:** Approved  

**Requirements:** [FR-009](../requirements.md)

## Preconditions

- The cart holds at least one product

## Main Success Scenario

1. The customer submits the cart with a quantity per product.
2. The system creates the order with today's date and the customer's name.
3. The system creates one order line per product, with the current price.
4. The system takes the ordered quantity of each product from its stock.
5. The system shows "Your order was placed."

## Alternative Flows

### A1: Not Enough Stock

**Trigger:** A product has less stock than the ordered quantity (step 4)  
**Flow:**

1. The system shows "A product is no longer available in this quantity." and places nothing.
2. Use case ends.

## Postconditions

### Success Postconditions

- The order exists with all its lines, and the stock of every ordered product is reduced

### Failure Postconditions

- No order and no order line exist, and no stock changed

## Business Rules

### BR-001: All or Nothing

An order is placed completely or not at all.

### BR-002: No Overselling

An order never takes more than the stock on hand, also when two customers order at the same moment.
