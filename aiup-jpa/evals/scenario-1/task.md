# Persistence Layer of "Register Guest" (UC-020) in a Hexagonal Backend

## Problem Description

A hotel booking backend at `backend/` is a hexagonal Maven reactor: `hotel-domain`, `hotel-business`,
`hotel-postgres`, `hotel-api`, `hotel-app`. One feature, `RoomType`, is implemented across all modules and shows the
project's conventions. The project records its layers in `docs/architecture/stack.md`.

The Migration layer of UC-020 "Register Guest" is already done: `V2__create_guest.sql` in `hotel-postgres` creates
the `guest` table. The use case is at `docs/use_cases/UC-020-register-guest.md`, the entity model at
`docs/entity_model.md`.

## Output Specification

Run the persistence layer skill for UC-020 directly (as `/jpa-persistence UC-020` would): everything the
service layer of UC-020 will need to store a guest and to check whether an email address is already registered. The
service, the REST controller, and the tests are written by other layer skills afterwards — do not write them.

End with the hand-over to the next layer.
