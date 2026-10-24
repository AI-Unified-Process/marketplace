# Build the Persistence Layer of "Browse Product Catalog" (UC-010)

## Problem Description

An online shop combines layer plugins: Flyway, jOOQ, Spring Boot services, and a Spring REST API. The `product`
table exists (`src/main/resources/db/migration/V001__create_product_table.sql`) and jOOQ generates its classes into
`com.example.shop.db` with the code generation plugin in `pom.xml`. The project already has one repository,
`CustomerRepository`, that shows its conventions. `docs/architecture/stack.md` records the layers.

The use case is `docs/use_cases/UC-010-browse-product-catalog.md`.

## Output Specification

Run the persistence layer skill for UC-010 directly (as `/jooq-persistence UC-010` would): write the repository and
the record types the service layer needs for this use case, keep the Markers table of `docs/architecture/stack.md`
current, and end with the layer's Handover block and the hand-off line.

Do not write services, controllers, migrations, or tests. You cannot run Maven; write the code as it would compile
against the generated classes.
