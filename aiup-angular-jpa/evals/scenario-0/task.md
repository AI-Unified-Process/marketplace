# Implement "Browse Product Catalog" (UC-010)

## Problem Description

An online shop's engineering team has already run `/flyway-migration` and `/entity-model` for their
Spring Boot + JPA + Angular project. The `product` table already exists (see the Flyway migration under
`inputs/backend/src/main/resources/db/migration/`), the entity model is at `docs/entity_model.md`, and
the use case is specified at `docs/use-cases/UC-010-browse-product-catalog.md`. Nobody has written any
backend or frontend code for this use case yet.

The backend is a single flat Maven project at `backend/` with package `com.example.shop`, using Spring
Boot 3, Spring Data JPA, and Flyway with `spring.jpa.hibernate.ddl-auto=validate` — there is no
hexagonal multi-module split in this project. The frontend is an Angular (standalone components)
project at `frontend/` with an existing empty `ProductCatalog` component already wired into
`app.routes.ts` at `/products`.

## Output Specification

Implement UC-010 end to end:

1. **Backend** (`backend/src/main/java/com/example/shop/...`): a `Product` JPA entity mapped onto the
   existing table, a Spring Data JPA repository, a service class implementing the "only in-stock,
   optional category filter" logic from BR-010, and a `@RestController` exposing the data as JSON
   through a DTO — never the raw `@Entity`.
2. **Frontend** (`frontend/src/app/...`): fill in (or replace) the `ProductCatalog` component so it
   fetches from the new endpoint and renders the product grid with a category filter dropdown, using
   Angular `signal()` state and a hand-written `HttpClient` service.

Do **not** create any test files or test classes — that is out of scope for this task.
