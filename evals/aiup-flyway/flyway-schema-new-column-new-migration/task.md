# Add the Discount Column for "Set Product Discount" (UC-012)

## Problem Description

An online shop runs Flyway, jOOQ, Spring Boot, and Vaadin Flow as separate layer plugins. The `product` table is
created by `V001__create_product_table.sql`. The entity model now gives the product a `discount` attribute, and the
use case `docs/use_cases/UC-012-set-product-discount.md` needs it.

## Output Specification

Run the migration layer for UC-012 directly (as `/flyway-schema UC-012` would). Report the migration you wrote, the
layer's Handover block, and the hand-off line.

Do not write Java code or tests.

This session's conversation is not kept. Append every message you write to the user, word for word and in order, to
`session-log.md` in the root of the working directory; that log is not part of the project.
