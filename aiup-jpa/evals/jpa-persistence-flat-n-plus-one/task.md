# Persistence Layer of "Search Reservations" (UC-031)

## Problem Description

A hotel booking backend is a flat Spring Boot project with Spring Data JPA and Flyway. `RoomType` and `Guest` are
mapped already; the Flyway migration `V003__create_reservation.sql` has created the `reservation` table, which no
Java code maps yet. The project records its layers in `docs/architecture/stack.md`.

The use case is at `docs/use_cases/UC-031-search-reservations.md`, the entity model at `docs/entity_model.md`, the
requirements at `docs/requirements.md`.

## Output Specification

Implement the persistence layer of UC-031 only: the mapping and the query the service layer will call to list the
reservations of a period. The service, the REST controller, and the tests are written
by other layer skills afterwards — do not write them.

End with the hand-over to the next layer.

This session's conversation is not kept. Append every message you write to the user, word for word and in order, to
`session-log.md` in the root of the working directory; that log is not part of the project.
