# Hotel Booking Schema Migration

## Problem Description

You're working on a hotel management application backed by a PostgreSQL database. The project uses Flyway for database version control. The development team has defined the domain model for a hotel booking system in `docs/entity_model.md`, covering room types, guests, and reservations.

The database already has one existing Flyway migration in the `migrations/` directory. Now the team needs the core hotel booking tables created as additional Flyway migration scripts so the application can be developed against the real schema.

Your job is to produce the SQL migration files that bring the database schema in line with the entity model. The migrations should be placed under `migrations/` and must be compatible with the existing Flyway setup. All entities described in `docs/entity_model.md` must be covered, with their columns, constraints, and relationships correctly reflected in SQL.

## Output Specification

Produce one or more Flyway versioned SQL migration files under `migrations/`. Each file should contain DDL statements to create the necessary database objects for one or more entities from the entity model. The files should be ready to apply with Flyway against a PostgreSQL database.

The migration files are the only output required — no application code, no documentation updates.
