# Write Backend Tests for "Browse Product Catalog" (UC-010)

## Problem Description

The ShopCatalog team has finished implementing the backend of UC-010 "Browse Product Catalog"
(spec at `docs/use-cases/UC-010-browse-product-catalog.md`). The vertical slice lives under
`ShopCatalog/Features/UC010_BrowseProductCatalog/`:

- `BrowseProductCatalogQuery.cs` — the query record with an optional category filter
- `BrowseProductCatalogHandler.cs` — resolves the query against `AppDbContext` (obtained from an
  `IDbContextFactory<AppDbContext>`) and enforces BR-010

An empty xUnit test project already exists at `ShopCatalog.Tests/` with EF Core SQLite available as
a package reference.

## Output Specification

Produce a backend test class for the handler at
`ShopCatalog.Tests/Features/UC010_BrowseProductCatalog/<ClassName>.cs` covering:

- The main scenario: all in-stock products are returned.
- BR-010: a product with `InStock = false` never appears in the result, with or without a filter.
- Alternative flow A1: filtering by category returns only that category's in-stock products.
- Alternative flow A2: filtering by a category with no in-stock products returns an empty result.

Set up a realistic relational EF Core test database and structure each test so that seeding,
execution, and verification cannot mask each other's bugs through EF Core change tracking.

This environment has no .NET SDK installed, so do **not** try to run `dotnet test` — just produce
the test source file(s). Do not create UI component tests or browser tests; those are handled by
separate testing skills.
