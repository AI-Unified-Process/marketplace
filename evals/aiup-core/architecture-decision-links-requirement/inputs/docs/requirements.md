# Requirements Catalog — Workshop Registration

**Last updated:** 2026-10-01

## Functional Requirements

| ID     | Title                   | User Story                                                                                                   | Priority | Status |
|--------|-------------------------|--------------------------------------------------------------------------------------------------------------|----------|--------|
| FR-001 | Manage workshops        | As an organizer, I want to create and edit workshops so that participants can register for them.            | Must     | Implemented |
| FR-002 | Register for a workshop | As a participant, I want to register for an upcoming workshop so that my place is reserved.                   | Must     | Implemented |
| FR-003 | Sign in                 | As an organizer, I want to sign in so that only organizers can manage workshops.                              | Must     | Implemented |

## Non-Functional Requirements

| ID      | Title              | Requirement                                                                                          | Category    | Priority | Status |
|---------|--------------------|------------------------------------------------------------------------------------------------------|-------------|----------|--------|
| NFR-001 | Registration time  | A registration completes within 2 seconds for 200 concurrent participants.                          | Performance | Must     | Implemented |
| NFR-002 | Session protection | A session token must not be readable by scripts running in the browser, so that an injected script cannot take over an organizer's session. | Security | Must | Open |

## Constraints

| ID    | Title    | Constraint                                                                           | Category  | Status |
|-------|----------|--------------------------------------------------------------------------------------|-----------|--------|
| C-001 | Database | Data is stored in PostgreSQL; schema changes are versioned with Flyway.             | Technical | Open   |
| C-002 | Front end | The web front end is a single-page application served from the same origin as the API. | Technical | Open   |
