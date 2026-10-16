# Requirements Catalog — Workshop Registration

**Last updated:** 2026-10-01

## Functional Requirements

| ID     | Title                   | User Story                                                                                                   | Priority | Status |
|--------|-------------------------|--------------------------------------------------------------------------------------------------------------|----------|--------|
| FR-001 | Manage workshops        | As an organizer, I want to create and edit workshops so that participants can register for them.            | Must     | Implemented |
| FR-002 | Register for a workshop | As a participant, I want to register for an upcoming workshop so that my place is reserved.                   | Must     | Open |
| FR-003 | List participants       | As an organizer, I want to see who registered for a workshop so that I can prepare the room and materials.  | Must     | Open |

## Non-Functional Requirements

| ID      | Title         | Requirement                                                                     | Category    | Priority | Status |
|---------|---------------|---------------------------------------------------------------------------------|-------------|----------|--------|
| NFR-001 | Name length   | A participant name has at most 100 characters; an email at most 255 characters. | Usability   | Must     | Open |

## Constraints

| ID    | Title    | Constraint                                                                          | Status |
|-------|----------|-------------------------------------------------------------------------------------|--------|
| C-001 | Database | Data is stored in PostgreSQL; schema changes are versioned with Flyway.            | Open   |
| C-002 | Channels | Participants and organizers use a Vaadin Flow web application; the partner portal uses a JSON REST API. | Open   |
