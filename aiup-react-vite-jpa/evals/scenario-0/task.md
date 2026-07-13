# Implement "Browse Product Catalog" (UC-010)

## Problem Description

An online shop's engineering team has already run `/flyway-migration` and `/entity-model` for their
Spring Boot + JPA + React/Vite project. The `product` table already exists (see the Flyway migration
under `inputs/backend/src/main/resources/db/migration/`), the entity model is at
`docs/entity_model.md`, and the use case is specified at
`docs/use-cases/UC-010-browse-product-catalog.md`. Nobody has written any backend or frontend code for
this use case yet.

The backend is a Maven project at `backend/` with package `com.example.shop`, using Spring Boot 3,
Spring Data JPA, and Flyway with `spring.jpa.hibernate.ddl-auto=validate`. The frontend is a Vite +
React (TypeScript) project at `frontend/` using React Router and TanStack Query, with an existing
`/products` route already wired up to an empty `ProductCatalogPage` placeholder component.

## Output Specification

Implement UC-010 end to end:

1. **Backend** (`backend/src/main/java/com/example/shop/...`): a `Product` JPA entity mapped onto the
   existing table, a Spring Data JPA repository, a service class implementing the "only in-stock,
   optional category filter" logic from BR-010, and a `@RestController` exposing the data as JSON
   through a DTO — never the raw `@Entity`.
2. **Frontend** (`frontend/src/...`): fill in (or replace) `ProductCatalogPage` so it fetches from the
   new endpoint and renders the product grid with a category filter dropdown, using the project's
   existing TanStack Query convention.

Do **not** create any test files or test classes — that is out of scope for this task.
