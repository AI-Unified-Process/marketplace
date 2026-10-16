# Build the Angular UI of "Browse Product Catalog" (UC-010)

## Problem Description

An online shop combines layer plugins: Flyway, JPA, Spring Boot, Angular, and Playwright, as recorded in
`docs/architecture/development.md`. `/use-case-implement UC-010` has already run the migration, persistence, service, and API layers
and now hands over to the UI layer. The API layer's Handover was:

```text
Handover from spring-rest (UC-010)
- GET /api/products?category={category}  → 200 List<ProductDto>; category optional; only in-stock products (BR-001 in ProductService)
- GET /api/products/categories            → 200 List<String>
- ProductDto(Long id, String name, String category, BigDecimal price, @Nullable String imageUrl)
- Errors: RFC 9457 Problem Details, message in "detail"
```

The Angular frontend is at `frontend/`; an empty `ProductCatalog` page is already routed at `/products`. The use case
is `docs/use_cases/UC-010-browse-product-catalog.md`, the entity model `docs/entity_model.md`.

## Output Specification

Implement the UI layer of UC-010 only: the HTTP service and its TypeScript model, and the `ProductCatalog` page with
the category filter and the empty state of A2. Keep `docs/architecture/development.md` up to date as the UI layer skill
requires. Do not write tests and do not touch the backend. End with the Handover block of the UI layer.
