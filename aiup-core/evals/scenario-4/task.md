# Bookstore API Documentation

## Problem Description

Your team has inherited an Express.js REST API for an online bookstore. The original developers are no longer available, and the codebase has no high-level documentation — just source code and a database schema. Before the team can make safe changes or onboard new engineers, you need to produce structured documentation that captures what the system actually does at the business level.

The codebase is located under `starter/`. It is a Node.js application using Express for routing, Prisma as the ORM, and JWT-based authentication. There are two kinds of users — regular customers and administrators — each with access to different parts of the system. The project also includes a test file under `starter/tests/` that names several user-facing workflows.

Your task is to reverse-engineer this codebase into three structured artifacts that will serve as the team's living documentation going forward. Do not run the application — work from static analysis of the source files only.

## Output Specification

Produce exactly the following files in your working directory:

1. **`docs/use_cases.puml`** — A PlantUML use case diagram listing all actors and the use cases they participate in. Use the system name from `starter/package.json`.

2. **`docs/use_cases/`** — A folder of use case specification documents, one per use case, named `UC-XXX-short-name.md` (kebab-case, three-digit ID). Each file must describe the full interaction: who the actor is, what they're trying to achieve, the step-by-step success scenario, any alternative flows (including error conditions), and the business rules the system enforces.

3. **`docs/entity_model.md`** — An entity model document with a Mermaid ER diagram and a detailed attribute table for each entity. Use business-level data types, not database-specific types.

Focus on what users are trying to accomplish — not on the individual API endpoints the system exposes.
