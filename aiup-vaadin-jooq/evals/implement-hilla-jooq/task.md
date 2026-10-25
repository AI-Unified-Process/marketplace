# Product Catalog View

## Problem Description

The merchandising team at ShopCo wants a new screen in the internal operations portal to browse the product catalog. Today the team looks products up in spreadsheets that go stale within days.

The portal frontend is built with **Hilla** — React/TypeScript views with file-based routing that call `@BrowserCallable` Java services — and the data access layer uses **jOOQ**. The data model and use case spec have already been written by the business analyst. A similar screen — the Customer Directory view — was recently implemented in the same style and can serve as a code pattern reference. Generated jOOQ table stubs for the relevant tables are already present.

Your job is to implement the **Browse Product Catalog** feature (UC-031) by adding the necessary data access layer, browser-callable service, and React view.

The use case spec is at `docs/use_cases/UC-031-browse-product-catalog.md`. The entity model is at `docs/entity_model.md`. Existing pattern code is in `src/main/java/com/example/shop/customer/` and `src/main/frontend/views/`.

The generated jOOQ classes you will need are in the `generated/` directory:

- `generated/tables/Products.java` — the PRODUCTS table descriptor (field constants: `PRODUCTS.ID`, `PRODUCTS.CATEGORY_ID`, `PRODUCTS.NAME`, `PRODUCTS.PRICE`, `PRODUCTS.STOCK_QUANTITY`)
- `generated/tables/Categories.java` — the CATEGORIES table (field constants: `CATEGORIES.ID`, `CATEGORIES.NAME`)
- `generated/tables/pojos/Product.java` — the generated POJO for a full product record

The package for new code should follow the existing convention: `com.example.shop.product`.

## Output Specification

Produce the following files:

- `src/main/java/com/example/shop/product/ProductSummaryDto.java` — a Java record holding the projected fields for the grid rows
- `src/main/java/com/example/shop/product/ProductRepository.java` — Spring `@Repository` with methods to query products using jOOQ
- `src/main/java/com/example/shop/product/ProductService.java` — the browser-callable service the frontend talks to
- `src/main/frontend/views/products.tsx` — the React view showing the catalog grid

Implement the data layer, service, and view only — separate testing concerns are handled by the team's dedicated testing workflows.
