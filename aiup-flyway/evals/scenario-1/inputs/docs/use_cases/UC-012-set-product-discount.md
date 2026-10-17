# Use Case: Set Product Discount

## Overview

**Use Case ID:** UC-012  
**Use Case Name:** Set Product Discount  
**Primary Actor:** Shop Manager  
**Goal:** Reduce the price of a product by a percentage so that slow-moving stock sells  
**Trigger:** The shop manager decides to discount a product  
**Status:** Approved  

**Requirements:** [FR-009](../requirements.md)

## Preconditions

- The shop manager is signed in
- The product exists in the catalog

## Main Success Scenario

1. The shop manager selects a product.
2. The shop manager enters a discount in percent.
3. The system stores the discount and shows the reduced price.

## Alternative Flows

### A1: Discount Out of Range

**Trigger:** The discount is above 50 or below 0 (step 2)  
**Flow:**

1. The system shows "The discount must be between 0 and 50 percent" and stores nothing.
2. Use case continues at step 2.

## Postconditions

### Success Postconditions

- The product carries the new discount

### Failure Postconditions

- The discount of the product is unchanged

## Business Rules

### BR-001: Maximum Discount

A discount is between 0 and 50 percent.
