# Use Case: Order Lunch

## Overview

**Use Case ID:** UC-001  
**Use Case Name:** Order Lunch  
**Primary Actor:** Employee  
**Goal:** Have a portion of a dish of today's menu kept so that the employee can eat it at lunch  
**Trigger:** An employee decides to eat in the canteen today  
**Status:** Approved  

**Requirements:** [FR-001](../requirements.md)  
**Layers:** API

## Preconditions

- Today's menu has at least one dish

## Main Success Scenario

1. The employee asks for today's menu.
2. The system lists each dish of today's menu with name, price, and the portions left.
3. The employee selects a dish and enters the employee number.
4. The employee places the order.
5. The system records the lunch order with the price the employee pays and returns it with the dish name, the price, and the time of the order.

## Alternative Flows

### A1: Dish Sold Out

**Trigger:** No portion of the selected dish is left (step 4)  
**Flow:**

1. The system rejects the order with the message "<dish name> is sold out."
2. Use case continues at step 3.

### A2: Lunch Already Ordered

**Trigger:** The employee already has a lunch order for today (step 4)  
**Flow:**

1. The system rejects the order with the message "You have already ordered a lunch for today."
2. Use case ends.

### A3: Dish Not on Today's Menu

**Trigger:** The selected dish is not on today's menu (step 4)  
**Flow:**

1. The system rejects the order with the message "This dish is not on today's menu."
2. Use case ends.

## Postconditions

### Success Postconditions

- A lunch order for today exists with the dish, the employee number, the price the employee pays, and the time of the order
- The portions left of the dish are one less than before

### Failure Postconditions

- No lunch order is recorded

## Business Rules

### BR-001: Portions

A dish accepts orders only while the number of its lunch orders is less than its portions.

### BR-002: One Lunch per Day

An employee has at most one lunch order per day.

### BR-003: Price

An employee pays the price of the dish; apprentices pay the reduced price.
