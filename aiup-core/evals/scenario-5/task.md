# Reverse-Engineer ArtisanShop into AIUP Artifacts

## Background

ArtisanShop is a Java/Spring Boot marketplace platform where independent artisans can list handmade products, buyers can browse and purchase them, and administrators manage the platform. The codebase was written two years ago and has grown significantly — it now spans multiple feature areas: authentication, user profiles, a product catalog, shopping and order fulfillment, notifications, and an admin back office with reporting.

The engineering lead wants to onboard new developers using the AI Unified Process methodology, starting with a full set of AIUP artifacts derived from the existing codebase. The goal is to have a use case diagram, individual use case specifications, and an entity model that a developer joining the team could read instead of spelunking through the source code.

The codebase is in the `inputs/` directory. It contains a `pom.xml`, Spring Security configuration, controller classes spread across several packages, JPA entity classes, and Flyway SQL migrations under `src/main/resources/db/migration/`.

## Your Task

Reverse-engineer the ArtisanShop codebase into the three AIUP artifacts:

1. `docs/use_cases.puml` — PlantUML use case diagram listing all actors and use cases
2. `docs/use_cases/` — one specification file per use case (e.g. `UC-001-place-order.md`)
3. `docs/entity_model.md` — entity model with Mermaid ER diagram and attribute tables

Because the codebase covers many features, document your approach in `docs/PLAN.md` as you work. The plan file must record:

- The full list of controller files you found in your initial scan of the codebase
- How you grouped those controller files into feature clusters before writing specs
- Which database tables you decided to exclude from the entity model, and why

Produce the `docs/PLAN.md` file first, then generate the three AIUP artifacts.

## Output Specification

All output files go under `docs/`:

- `docs/PLAN.md` — clustering plan (controller list, feature groups, excluded tables)
- `docs/use_cases.puml` — PlantUML diagram
- `docs/use_cases/UC-XXX-short-name.md` — one file per use case (kebab-case filenames)
- `docs/entity_model.md` — entity model

Do not modify any file under `inputs/`.
