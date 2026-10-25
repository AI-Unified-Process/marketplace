# Use Case: Browse Product Catalog

## Overview

**Use Case ID:** UC-010  
**Use Case Name:** Browse Product Catalog  
**Primary Actor:** Shopper  
**Goal:** View the available products and narrow them down by category to find what can be bought  
**Trigger:** The shopper opens the product catalog  
**Status:** Approved  

## Preconditions

- The product catalog contains at least one product per category

## Main Success Scenario

1. The shopper navigates to the Product Catalog page.
2. The system displays a grid of all in-stock products with name, category, and price.
3. The shopper reviews the list.

## Alternative Flows

### A1: Filter by Category

**Trigger:** The shopper selects a category from the category filter dropdown (step 3)  
**Flow:**

1. The shopper selects a category from the category filter dropdown.
2. The system displays only the products matching the selected category.
3. Use case continues at step 3.

### A2: No Products Match Filter

**Trigger:** The selected category has no in-stock products (step 3)  
**Flow:**

1. The shopper selects a category with no in-stock products.
2. The system displays an empty-state message instead of the grid.
3. Use case ends.

## Postconditions

### Success Postconditions

- The shopper has seen the current in-stock catalog, optionally filtered by category

### Failure Postconditions

- No product data is changed

## Business Rules

### BR-001: Only In-Stock Products Are Shown

Products that are not in stock never appear in the catalog grid, regardless of the selected filter.
