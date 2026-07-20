# Reverse-Engineer .NET 10 Blazor Application into AIUP Artifacts

## Background

An engineering team maintains a C# / Blazor .NET 10 e-commerce platform (`inputs/ArtisanShop.Web`). The application uses Entity Framework Core for data access (`DbContext`), Blazor interactive components (`.razor`) for UI, ASP.NET Core Identity for authentication, and EF Core migrations under `Migrations/`.

The engineering lead wants to produce a full set of AIUP artifacts from the existing .NET codebase so new developers can understand system capabilities without reading through C# source files.

The codebase is in the `inputs/` directory. It contains an `ArtisanShop.sln`, `ArtisanShop.csproj`, `Program.cs`, Blazor page components under `Components/Pages/`, EF Core `DbContext` entity configurations, and EF Core migration snapshots under `Migrations/`.

## Your Task

Each artifact must conform exactly to the standard AIUP document format — diagram layout, spec structure, and entity model attribute tables using the closed AIUP data-type vocabulary (Long, Integer, String, Decimal, Boolean, Date, DateTime).

Reverse-engineer the .NET 10 codebase into the three AIUP artifacts:

1. `docs/use_cases.puml` — PlantUML use case diagram listing all actors and use cases
2. `docs/use_cases/` — one specification file per use case (e.g. `UC-001-place-order.md`)
3. `docs/entity_model.md` — entity model with Mermaid ER diagram and attribute tables

Document your approach in `docs/PLAN.md` before writing specs, recording:
- The full list of Blazor components (`.razor`), Minimal APIs, or Controllers found during initial scan
- How you grouped those entry points into feature clusters
- Any infrastructure tables excluded from the entity model

## Output Specification

All output files go under `docs/`:

- `docs/PLAN.md` — clustering plan
- `docs/use_cases.puml` — PlantUML diagram
- `docs/use_cases/UC-XXX-short-name.md` — one file per use case (kebab-case filenames)
- `docs/entity_model.md` — entity model

Do not modify any file under `inputs/`.
