# Test the product catalogue feature (UC-010)

## Problem Description

An online shop's NestJS + Drizzle backend has a fully implemented `products` feature at
`apps/api/src/products/` — module, controller, service, repository, and DTOs. It serves
`GET /api/products` with an optional `category` query parameter, and it has **no tests at all**.

The use case it implements is specified at `docs/use_cases/UC-010-browse-product-catalog.md`,
including alternative flow A1 and business rule BR-010.

The project has Vitest configured for unit tests (`vitest.config.ts`, `npm run test:unit`) and a
`test:e2e` script, but no end-to-end test has ever actually been written or run — there is no e2e
test directory and no test infrastructure beyond the unit config. The application boots against
PostgreSQL and its global `ValidationPipe` is configured with `whitelist`,
`forbidNonWhitelisted`, and `transform`.

## Output Specification

Write tests for UC-010 at both levels:

1. **Unit** — cover the service's logic and its mapping to the response shape, without a database.
2. **End-to-end** — cover the endpoint's real behaviour over HTTP, including the main success
   scenario, alternative flow A1, and business rule BR-010, against a real PostgreSQL database
   rather than a substitute.

Make whatever configuration changes the tests need in order to run.
