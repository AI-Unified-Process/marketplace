# Implement "Register Guest" (UC-020) in a Hexagonal Multi-Module Backend

## Problem Description

A hotel booking system's backend is a Maven reactor at `backend/` with five modules — `hotel-domain`,
`hotel-business`, `hotel-postgres`, `hotel-api`, `hotel-app` — following a hexagonal (ports and adapters)
architecture. Only one feature exists so far, `RoomType`, fully wired across every module:

- `hotel-domain`: `com.example.hotel.domain.roomtype.RoomType` — a pure record, zero
  framework imports.
- `hotel-business`: `com.example.hotel.business.roomtype.RoomTypeService` (concrete `@Service`),
  `RoomTypeRepository` (the one real port — a plain interface sitting next to the service, not in a
  `port` subpackage), `dto.RoomTypeDTO` (a record with a static `fromBusiness(RoomType)` factory method).
- `hotel-postgres`: `postgres.roomtype.model.RoomTypeEntity` (separate JPA `@Entity`),
  `postgres.roomtype.converter.{RoomTypeConverter,RoomTypeEntityConverter}` (hand-written static
  converters), `postgres.roomtype.query.RoomTypeJpaRepository` (Spring Data `JpaRepository`),
  `postgres.roomtype.RoomTypeRepositoryImpl` (implements the business module's port), and the Flyway
  migration `V1__create_room_type.sql`.
- `hotel-api`: `com.example.hotel.api.roomtype.RoomTypeController` — a `@RestController` that calls the
  **concrete** `RoomTypeService` directly. There is **no inbound port/use-case interface anywhere in this
  reactor** — the controller depends on the service class, not an interface.

The entity model is at `docs/entity_model.md` (includes both `RoomType`, already implemented, and
`Guest`, not yet implemented). The use case to implement is specified at
`docs/use-cases/UC-020-register-guest.md`.

## Output Specification

Implement UC-020 "Register Guest" by following the **exact same pattern** as the existing `RoomType`
feature, across the same five modules:

1. `hotel-domain`: a pure `Guest` record (no framework imports).
2. `hotel-business`: a concrete `GuestService`, a `GuestRepository` port interface (plain sibling file,
   matching `RoomTypeRepository`'s placement — do **not** put it in a `port` subpackage), and a
   `GuestDTO` record with a static `fromBusiness(Guest)` factory method.
3. `hotel-postgres`: a `GuestEntity` JPA entity, hand-written static converters (matching the
   `RoomTypeConverter`/`RoomTypeEntityConverter` naming and shape — do **not** use MapStruct or any
   other mapping library), a `GuestJpaRepository` Spring Data interface, a `GuestRepositoryImpl`
   implementing the business module's port, and a new Flyway migration (`V2__create_guest.sql`) in this
   module's own `src/main/resources/db/migration` — enforce the email uniqueness from BR-020 at the
   database level too.
4. `hotel-api`: a `GuestController` that calls the **concrete** `GuestService` directly — do **not**
   create an inbound port/use-case interface for this feature; none exists anywhere in the reactor today,
   so match that.

Do **not** create any test files or test classes — that is out of scope for this task.
