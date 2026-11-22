# Extend the Hotel Booking Schema with Reservations and Payments

## Problem Description

The hotel booking team has been running their system for several months with a database that tracks room types and guests. Now they are ready to launch the core booking workflow and need the database schema to support it.

The engineering team uses Flyway to manage all schema changes. Two migrations already exist in `db/migration/` — they handle the `room_type` and `guest` tables. The updated entity model, describing all four entities the system needs to support, is available in `docs/entity_model.md`.

Your task is to extend the schema by adding the two new entities — `Reservation` and `Payment` — as Flyway migration files. These migrations must integrate cleanly with the existing schema: references must be correct, table creation order must respect the dependency graph, and the files must be placed alongside the existing migrations in `db/migration/`.

## Output Specification

Create the necessary Flyway SQL migration file(s) inside `db/migration/` to add the `Reservation` and `Payment` tables to the schema. The files must be placed in the correct location so that Flyway will pick them up in sequence after the two existing migrations.

Do not modify or delete the existing migration files `V001__create_room_type_table.sql` or `V002__create_guest_table.sql`.
