# Build the Persistence Layer of "Place Order" (UC-030)

## Problem Description

An online shop combines Drizzle, NestJS services, and a REST API; `docs/architecture/stack.md` records the layers. The
`product`, `purchase_order`, and `order_line` tables exist in `apps/api/src/database/schema.ts`, and
`apps/api/src/products/products.repository.ts` already reads products. There is no repository for orders yet.

The use case is `docs/use_cases/UC-030-place-order.md`; the entity model is `docs/entity_model.md`.

## Output Specification

Run the persistence layer skill for UC-030 directly (as `/drizzle-persistence UC-030` would): the repository methods
and types the service needs to place an order. End with the Handover block and the hand-off line.

Do not write services, controllers, schema changes, migrations, or tests.

This session's conversation is not kept. Append every message you write to the user, word for word and in order, to
`session-log.md` in the root of the working directory; that log is not part of the project.
