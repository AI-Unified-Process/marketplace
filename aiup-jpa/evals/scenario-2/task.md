# Persistence Tests of "Search Reservations" (UC-031)

## Problem Description

A hotel booking backend is a flat Spring Boot project with Spring Data JPA, Flyway, and PostgreSQL. UC-031 "Search
Reservations" is implemented: `ReservationRepository.findArrivals(from, to)` returns `ReservationListItem` records.
The project has a `UseCase` annotation and a `TestcontainersConfiguration` test class, but no repository test yet.
The project records its layers in `docs/architecture/stack.md`.

The use case is at `docs/use_cases/UC-031-search-reservations.md`, the entity model at `docs/entity_model.md`.

## Output Specification

Run the persistence test skill for UC-031 directly (as `/jpa-persistence-test UC-031` would): write the persistence
tests of UC-031 only. The service and API tests are written by other test skills — do not write them. Do not change
production code.

Report which tests you wrote and the command that runs them, and end with the hand-off to the next step.
