---
name: ef-migration
description: >
  Generates Entity Framework Core (EF Core) database migrations for C# / .NET
  projects based on the entity model specification in docs/entity_model.md.
  Use when the user asks to "create database migration", "add ef migration",
  "update schema with ef core", "generate db migration for .net", or mentions
  EF Core, DbContext, or database migrations in C#.
---

# EF Core Database Migration

## Goal

Create a native EF Core C# Migration (`dotnet ef migrations add <MigrationName>`) and configure entity models in `DbContext` based on `docs/entity_model.md`.

## Instructions

1. **Read `docs/entity_model.md`** to inspect the required entities, attributes, relationships, and validation constraints.
2. **Inspect existing `DbContext` and Entity Classes** under the project solution (`.csproj`).
3. **Generate/Update Entity Classes & Configurations**:
   - Represent entities as C# classes with file-scoped namespaces and modern properties (e.g. `public required string Name { get; set; }`).
   - Implement `IEntityTypeConfiguration<T>` for Fluent API mappings (table names, column types, precision, foreign keys, unique indexes).
   - Register configurations in `OnModelCreating(ModelBuilder modelBuilder)`.
4. **Generate EF Core Migration**:
   - Run `dotnet ef migrations add UCXXX_Description` using CLI.
   - Verify the generated migration class under `Migrations/`.
5. **DO NOT**:
   - Execute destructive schema drops on production environments.
   - Hardcode connection strings in source code; use `appsettings.json` or environment variables.

6. **Next Step Guidance**:
   - Conclude your response by summarizing the migration created and guiding the user to implementation:
   > "Next step: Run `/implement UC-XXX` (e.g. `/implement UC-001`) to construct your vertical slice feature."
