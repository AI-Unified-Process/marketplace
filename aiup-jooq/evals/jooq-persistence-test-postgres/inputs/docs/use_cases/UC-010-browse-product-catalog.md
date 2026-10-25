# Use Case: Browse Product Catalog

## Overview

**Use Case ID:** UC-010  
**Use Case Name:** Browse Product Catalog  
**Primary Actor:** Shopper  
**Goal:** View the products in stock and narrow them down by category to find what can be bought  
**Trigger:** The shopper opens the product catalog  
**Status:** Approved  

**Requirements:** [FR-007, NFR-002](../requirements.md)

## Preconditions

- The product catalog contains at least one product per category

## Main Success Scenario

1. The shopper opens the product catalog.
2. The system lists the in-stock products with name, category, and price, ordered by name, 20 per page.
3. The shopper pages through the list.

## Alternative Flows

### A1: Filter by Category

**Trigger:** The shopper selects a category (step 3)  
**Flow:**

1. The shopper selects a category.
2. The system lists only the in-stock products of that category.
3. Use case continues at step 3.

### A2: No Products Match Filter

**Trigger:** The selected category has no in-stock products (step 3)  
**Flow:**

1. The shopper selects a category without in-stock products.
2. The system shows "No products in this category" instead of the list.
3. Use case ends.

## Postconditions

### Success Postconditions

- The shopper has seen the current in-stock catalog, optionally filtered by category

### Failure Postconditions

- No product data is changed

## Business Rules

### BR-001: Only In-Stock Products Are Shown

Products that are not in stock never appear in the catalog, regardless of the selected category.
