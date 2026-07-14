# Write End-to-End Tests for "Browse Product Catalog" (UC-010)

## Problem Description

The Product Catalog page for UC-010 (spec at `docs/use-cases/UC-010-browse-product-catalog.md`) is
fully implemented and running. The frontend (Vite dev server) is reachable at
`http://localhost:5173/products`, and it calls a Spring Boot backend at `http://localhost:8080` through
a Vite proxy.

Rendered page structure, for reference (do not write tests against implementation code — this is
purely what a shopper sees in the browser):

- A page heading with the accessible name "Product Catalog"
- A table where each product is one row (`role="row"`), showing name, category, and price; the header
  row also has `role="row"`
- A `<select>` labelled "Category" (accessible via `getByLabel`) listing the distinct product
  categories plus an "All" option
- When a category filter matches no in-stock products, the table is replaced by a paragraph with
  `role="alert"` reading "No products found in this category."
- Test data seeded via Flyway includes products in categories "Electronics", "Books", and "Outdoor",
  with at least one out-of-stock product in "Outdoor" and no in-stock products at all in a fourth
  category, "Clearance"

## Output Specification

Write Playwright end-to-end tests covering:

1. The main scenario: the table loads and displays in-stock products.
2. The alternative flow (A1) for filtering by the "Electronics" category.
3. The alternative flow (A2) for selecting "Clearance" (no in-stock products) and seeing the empty-state
   alert instead of the table.

Place the test file under `frontend/tests/e2e/`. Do **not** run the tests — just produce the source
file.
