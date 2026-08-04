# Extend the Data Model for Order Management (UC-020)

## Problem Description

The ShopCatalog team is preparing UC-020 "Place Order". The entity model at `docs/entity_model.md`
has been extended with two new entities, `Customer` and `Order`, alongside the existing `Product`.

The project is a .NET 10 Blazor application using EF Core with PostgreSQL. The `Product` entity is
already mapped (`Domain/Product.cs`, `Data/ProductConfiguration.cs`) and registered in
`Data/AppDbContext.cs`.

## Output Specification

Bring the EF Core model in line with `docs/entity_model.md`:

1. **Entity classes** for `Customer` and `Order` under `Domain/`, honoring every data type,
   length/precision, default, and relationship in the entity model.
2. **EF Core configurations** for both entities under `Data/`, and whatever `AppDbContext` changes
   are needed so the new entities are part of the model.
3. **Migration**: this environment has no .NET SDK installed, so do **not** try to execute the EF
   Core CLI. Instead, finish by writing out the exact migration command the team should run,
   following this project's migration naming convention for use-case-driven schema changes.

Do **not** create any test files, and do **not** put database credentials anywhere in source code.
