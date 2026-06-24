# Write Server-Side Tests for the Product Catalog View

## Problem Description

The engineering team at an online shop has built a product catalog feature using Vaadin. The catalog view (`ProductCatalogView`) displays a grid of products and lets shoppers filter by category using a dropdown. The use case spec is at `docs/use-cases/UC-010-browse-product-catalog.md`.

The team wants robust server-side unit tests covering the main success scenario, the "filter by category" alternative flow, and the business rule about stock status visibility. They want these tests to run entirely in the JVM — no browser, no WebDriver — and to plug into the AIUP IntelliJ Navigator plugin so gutter icons link spec headings to test methods.

The source for the view is in `src/main/java/com/example/shop/view/ProductCatalogView.java`. The project uses Spring Boot, Maven, and the standard `com.example.shop` package structure.

## Output Specification

Produce the following files in the project:

1. **A `UseCase` annotation** (if one does not already exist) — place it at `src/main/java/com/example/shop/usecase/UseCase.java`.
2. **A Browserless test class** for UC-010 — place it at `src/test/java/com/example/shop/view/<ClassName>.java`. Choose the class name according to the standard test naming convention for this type of test.
3. **A Flyway test migration SQL file** at `src/test/resources/db/migration/<filename>.sql` that populates the product and category data your tests depend on. Use sequences for primary keys, following the project's Flyway conventions.

The test class should cover:
- The main scenario: the grid loads products when the view opens.
- The alternative flow for filtering by category.
- The empty-state alternative flow when no products match.
- The business rule about stock status being present.

Do **not** run the tests — just produce the source files.
