# Requirements Catalog — Workshop Registration

**Last updated:** 2026-10-20

## Functional Requirements

| ID     | Title                   | User Story                                                                                                   | Priority | Status |
|--------|-------------------------|--------------------------------------------------------------------------------------------------------------|----------|--------|
| FR-001 | Manage workshops        | As an organizer, I want to create and edit workshops so that participants can register for them.            | Must     | Verified |
| FR-002 | Register for a workshop | As a participant, I want to register for an upcoming workshop so that my place is reserved.                   | Must     | Verified |
| FR-003 | List participants       | As an organizer, I want to see who registered for a workshop so that I can prepare the room and materials.  | Must     | Implemented |
| FR-004 | Cancel a registration   | As a participant, I want to cancel my registration so that my place is free for someone else.                | Must     | Verified |
| FR-005 | Send reminders          | As an organizer, I want to remind participants before a workshop so that fewer of them miss it.             | Could    | Open |
| FR-006 | Export participants     | As an organizer, I want to export the participants of a workshop so that I can print an attendance sheet.   | Should   | Open |

## Non-Functional Requirements

| ID      | Title         | Requirement                                                                     | Category    | Priority | Status |
|---------|---------------|---------------------------------------------------------------------------------|-------------|----------|--------|
| NFR-001 | Name length   | A participant name has at most 100 characters; an email at most 255 characters. | Usability   | Must     | Verified |

## Constraints

| ID    | Title    | Constraint                                                                 | Status |
|-------|----------|----------------------------------------------------------------------------|--------|
| C-001 | Database | Data is stored in PostgreSQL; schema changes are versioned with Flyway.   | Open   |
