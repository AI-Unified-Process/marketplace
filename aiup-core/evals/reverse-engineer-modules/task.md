# Hotel Property Management System Documentation

## Problem Description

Your team has taken over the property management system of a hotel group. It is a Spring Boot application built with
Maven and has grown over several years: reservations, the front desk, housekeeping, billing, and a loyalty programme
all live in one code base. Online guests, receptionists, housekeepers and their supervisors, accountants, and the hotel
manager each use their own part of it, and a payment provider confirms card payments. There is no documentation
beyond the source code, the database migrations, and a few tests.

The codebase is located under `starter/`. Do not run the application — work from static analysis of the source files
only.

A previous attempt to document the system produced one use case diagram and one ER diagram for everything. Nobody
could read either of them: the diagrams were too large to follow, and every reviewer had to find their own part of the
system first. The new documentation must stay readable for a system of this size, and each team should be able to
review the part of the system it is responsible for.

The team documents its systems with the AI Unified Process, so the three artifacts must conform exactly to the
standard AI Unified Process document formats — the same formats the AI Unified Process forward-engineering workflow
produces for use case diagrams, use case specifications, and entity models. Deviations from the standard structure,
headings, or data-type and validation vocabulary will be rejected when the documents are checked in.

## Output Specification

Produce exactly the following files in your working directory, and no other documentation files:

1. **The use case diagram** — starting at `docs/use_cases.puml`, the PlantUML use case diagram(s) of the system with
   all actors and the use cases they participate in.

2. **The use case specifications** — under `docs/use_cases/`, one document per use case, named
   `UC-XXX-short-name.md` (kebab-case, three-digit ID).

3. **The entity model** — starting at `docs/entity_model.md`, the Mermaid ER diagram(s) and a detailed attribute table
   for each entity. Use business-level data types, not database-specific types.

Focus on what users are trying to accomplish — not on the individual API endpoints the system exposes.
