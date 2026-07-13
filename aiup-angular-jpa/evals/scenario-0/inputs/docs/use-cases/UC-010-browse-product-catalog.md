**Use Case ID:** UC-010
**Name:** Browse Product Catalog
**Primary Actor:** Shopper
**Goal:** View available products and narrow them down by category
**Status:** Approved

## Preconditions

- The product catalog contains at least one product per category

## Main Success Scenario

1. The shopper navigates to the Product Catalog page
2. The system displays a grid of all in-stock products with name, category, and price
3. The shopper reviews the list

## Alternative Flows

### A1: Filter by Category

1. The shopper selects a category from the category filter dropdown
2. The system displays only the products matching the selected category

### A2: No Products Match Filter

1. The shopper selects a category with no in-stock products
2. The system displays an empty-state message instead of the grid

## Postconditions

- The shopper has seen the current in-stock catalog, optionally filtered by category

## Business Rules

### BR-010: Only In-Stock Products Are Shown

Products with `inStock = false` must never appear in the catalog grid, regardless of the selected
filter.
