# Use Case: Confirm Order

## Overview

**Use Case ID:** UC-020  
**Use Case Name:** Confirm Order  
**Primary Actor:** Sales Clerk  
**Goal:** Confirm an open order after checking its lines so that it can be fulfilled  
**Trigger:** The sales clerk opens an open order to confirm it  
**Status:** Approved  

**Requirements:** [FR-008](../requirements.md)

## Preconditions

- The sales clerk is logged in
- An order with status OPEN exists

## Main Success Scenario

1. The sales clerk opens an open order.
2. The system shows the order date and every order line with product name, quantity, and price.
3. The sales clerk confirms the order.
4. The system sets the status to CONFIRMED.

## Alternative Flows

### A1: Order Changed Meanwhile

**Trigger:** Another user changed the order after the sales clerk opened it (step 3)  
**Flow:**

1. The system shows "The order was changed by someone else. Please reload it." and confirms nothing.
2. Use case ends.

## Postconditions

### Success Postconditions

- The order has the status CONFIRMED

### Failure Postconditions

- The order and its lines are unchanged

## Business Rules

### BR-001: Only Open Orders Can Be Confirmed

An order can be confirmed only while its status is OPEN.
