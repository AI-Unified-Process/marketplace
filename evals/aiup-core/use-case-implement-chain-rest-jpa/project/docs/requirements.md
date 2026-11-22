# Requirements Catalog — Canteen Lunch Orders

**Last updated:** 2026-10-20

## Functional Requirements

| ID     | Title       | User Story                                                                                              | Priority | Status |
|--------|-------------|---------------------------------------------------------------------------------------------------------|----------|--------|
| FR-001 | Order lunch | As an employee, I want to order a dish of today's menu from the canteen app so that a portion is kept for me. | Must     | Open   |

## Constraints

| ID    | Title    | Constraint                                                                                          | Category  | Priority | Status |
|-------|----------|-----------------------------------------------------------------------------------------------------|-----------|----------|--------|
| C-001 | Database | Data is stored in PostgreSQL; schema changes are versioned with Flyway.                             | Technical | Must     | Open   |
| C-002 | Channels | The system offers a JSON REST API only; the canteen app that calls it is built by another team.     | Technical | Must     | Open   |
