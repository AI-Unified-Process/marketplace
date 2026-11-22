# Write the API tests of "Browse Product Catalog" (UC-010)

## Problem Description

An online shop has a NestJS + Drizzle backend in `apps/api`. `docs/architecture/stack.md` records the layers and the
test commands. The `products` feature at `apps/api/src/products/` implements UC-010 and serves `GET /api/products` with
an optional `category` query parameter. It has no tests at all, and no test infrastructure exists beyond the unit config.

The specification is at `docs/use_cases/UC-010-browse-product-catalog.md`.

## Output Specification

Run `/nest-rest-test UC-010`: write the API layer tests of UC-010 only, and make whatever configuration changes they
need. There is no Docker in this environment, so you cannot run them; say so in the report instead of claiming they
pass.

This session's conversation is not kept. Append every message you write to the user, word for word and in order, to
`session-log.md` in the root of the working directory; that log is not part of the project.
