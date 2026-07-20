# Implement "Browse Product Catalog" (UC-010)

## Problem Description

An engineering team building a .NET 10 Blazor application has derived their entity model at `docs/entity_model.md` and use case specification at `docs/use-cases/UC-010-browse-product-catalog.md`.

The project is structured as a .NET 10 Web Application using Vertical Slice Architecture under `Features/`.

## Output Specification

Implement UC-010 end to end under `Features/UC010_BrowseProductCatalog/`:

1. **Vertical Slice**:
   - `BrowseProductCatalogPage.razor` & `.razor.cs` Blazor components.
   - `BrowseProductCatalogQuery.cs` & `BrowseProductCatalogHandler.cs` handling data fetching.
   - EF Core entity mapping for `Product` entity.
2. **Business Rule Enforcement**:
   - Enforce filtering of out-of-stock items per BR-010.

Do **not** create any test files — that is handled by separate testing skills.
