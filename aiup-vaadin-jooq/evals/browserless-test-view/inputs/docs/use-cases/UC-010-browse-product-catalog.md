# UC-010: Browse Product Catalog

**Use Case ID:** UC-010  
**Name:** Browse Product Catalog  
**Actor:** Shopper

## Main Success Scenario

1. Shopper opens the product catalog page.
2. System displays a grid of all available products, each showing name, category, and stock status.
3. Shopper browses the full list.

### A1: Filter by Category

1. Shopper selects a category from the category filter dropdown.
2. System updates the product grid to show only products matching the selected category.
3. Shopper sees only the filtered products.

### A2: No Products Match Filter

1. Shopper selects a category that has no products.
2. System displays an empty grid.
3. Shopper sees a message or empty state indicating no products are available.

## Business Rules

### BR-010

Every product row in the catalog grid must display the current stock status (e.g., "In Stock", "Out of Stock", "Low Stock").
