# Implement "Browse Product Catalog" (UC-010)

## Problem Description

An online shop's engineering team has already run `/entity-model` and `/drizzle-migration` for
their NestJS + Drizzle + Next.js project. The `product` table already exists in the Drizzle schema
(`apps/api/src/database/schema.ts`), the entity model is at `docs/entity_model.md`, and the use
case is specified at `docs/use_cases/UC-010-browse-product-catalog.md`. Nobody has written any
backend or frontend code for this use case yet.

The repository is an npm workspace with two applications. The backend at `apps/api` is NestJS 11
on ESM/NodeNext with Drizzle ORM over PostgreSQL; its existing `categories` feature shows the
conventions this team follows. The frontend at `apps/web` is Next.js on the App Router, with an
existing but empty `products` route at `apps/web/src/app/products/page.tsx`. The frontend reaches
the API through the `/api/*` rewrite configured in `apps/web/next.config.ts`.

## Output Specification

Implement UC-010 end to end:

1. **Backend** (`apps/api/src/...`): a products feature that reads the existing `product` table,
   applies the "available only, optional category filter" logic from BR-010, and exposes the
   result as JSON through a REST endpoint returning a response DTO — never the raw database row.
2. **Frontend** (`apps/web/src/app/products/page.tsx`): fill in the empty page so it fetches from
   the new endpoint and renders the product list with a category filter control, matching
   alternative flow A1.

Do **not** create any test files — that is out of scope for this task.
