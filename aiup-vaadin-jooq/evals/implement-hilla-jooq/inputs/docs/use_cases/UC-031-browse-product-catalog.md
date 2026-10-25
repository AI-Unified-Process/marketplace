# UC-031: Browse Product Catalog

## Summary

A merchandiser can browse the product catalog, viewing a grid of all products with their category, and inspect the full details of any individual product.

## Actors

- Merchandiser

## Preconditions

- The merchandiser is logged in.
- At least one product exists in the system.

## Main Success Scenario

1. The merchandiser navigates to the Product Catalog screen.
2. The system loads and displays a grid showing all products. Each row shows:
   - Product name
   - Category name
   - Price
   - Stock quantity
3. The merchandiser clicks a row in the grid.
4. The system displays the full details of the selected product in a detail panel.

## Business Rules

### BR-001: Product Grid Columns

The grid must show exactly: Product name, Category name (joined from the category table), Price, and Stock quantity.

### BR-002: Detail Panel

Clicking a grid row loads the complete product record and displays it in a detail panel alongside the grid.

## Alternative Scenarios

### A1: No Products Found

If no products exist, the grid shows an empty state message: "No products found."

## Post-conditions

- No data is modified.
