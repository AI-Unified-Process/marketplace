# Requirements Catalog — Clinic Scheduling

**Last updated:** 2026-10-01

## Functional Requirements

| ID     | Title               | User Story                                                                                         | Priority | Status |
|--------|---------------------|----------------------------------------------------------------------------------------------------|----------|--------|
| FR-001 | Book appointment    | As a front desk clerk or a patient using the mobile app, I want to book an appointment.            | Must     | Open   |
| FR-002 | Manage opening hours | As a front desk clerk, I want to maintain the clinic's opening hours.                             | Must     | Open   |
| FR-003 | Query free slots    | As the insurance partner, I want to query free slots so that I can offer them to insured persons. | Should   | Open   |

## Constraints

| ID    | Title    | Constraint                                                                                         | Status |
|-------|----------|----------------------------------------------------------------------------------------------------|--------|
| C-001 | Channels | The front desk uses a Vaadin Flow UI; the mobile app and partners use a JSON REST API.             | Open   |
| C-002 | Database | Data is stored in PostgreSQL with jOOQ; schema changes are versioned with Flyway.                  | Open   |
