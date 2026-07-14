# Write Backend Tests for "Browse Product Catalog" (UC-010)

## Problem Description

The engineering team has finished implementing the backend for UC-010 "Browse Product Catalog" in
their Spring Boot + JPA project. The use case spec is at
`docs/use-cases/UC-010-browse-product-catalog.md`. The implementation is already in the project under
`backend/src/main/java/com/example/shop/product/`:

- `Product.java` — the JPA entity
- `ProductRepository.java` — Spring Data JPA repository with `findByInStockTrue()` and
  `findByInStockTrueAndCategory(String category)`
- `ProductDto.java` — the response DTO (`id`, `name`, `category`, `price` — no `inStock` field)
- `ProductService.java` — enforces BR-010 (only in-stock products, optional category filter)
- `ProductController.java` — exposes `GET /api/products?category=...` returning `List<ProductDto>`

The team wants integration tests covering the main success scenario, the "filter by category"
alternative flow (A1), and the "no products match" alternative flow (A2) — exercised through the real
`@RestController` → service → repository → database stack, no mocking. They also want these tests to
plug into the AIUP IntelliJ Navigator plugin, so gutter icons link the spec headings to test methods.

## Output Specification

Produce the following files in the project:

1. **A `UseCase` annotation** (if one does not already exist) — place it at
   `backend/src/main/java/com/example/shop/usecase/UseCase.java`.
2. **A Spring Boot test class** for UC-010 — place it at
   `backend/src/test/java/com/example/shop/product/<ClassName>.java`. Choose the class name according
   to the standard test naming convention for this type of test.
3. **A Flyway test migration SQL file** at `backend/src/test/resources/db/migration/<filename>.sql`
   that populates product test data covering multiple categories, at least one in-stock and one
   out-of-stock product, and at least one category with no in-stock products.

The test class should cover:

- The main scenario: the endpoint returns all in-stock products.
- The alternative flow for filtering by category.
- The alternative flow where no in-stock products match the selected category (empty list, not an
  error).
- The business rule that out-of-stock products never appear, even without a category filter.

Do **not** run the tests — just produce the source files.
