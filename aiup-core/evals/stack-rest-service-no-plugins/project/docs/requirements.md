# Requirements Catalog — Inventory Service

**Last updated:** 2026-10-01

## Functional Requirements

| ID     | Title           | User Story                                                                                     | Priority | Status |
|--------|-----------------|------------------------------------------------------------------------------------------------|----------|--------|
| FR-001 | Register item   | As a warehouse system, I want to register a new stock item so that it can be stored.           | Must     | Open   |
| FR-002 | Book stock move | As a warehouse system, I want to book an incoming or outgoing quantity so that stock is right. | Must     | Open   |
| FR-003 | Query stock     | As the web shop, I want to query the available quantity of an item so that I can show it.      | Must     | Open   |

## Non-Functional Requirements

| ID      | Title         | Requirement                                                              | Category    | Priority | Status |
|---------|---------------|--------------------------------------------------------------------------|-------------|----------|--------|
| NFR-001 | Response time | A stock query answers within 200 ms at the 95th percentile.              | Performance | Must     | Open   |

## Constraints

| ID    | Title         | Constraint                                                                        | Status |
|-------|---------------|-----------------------------------------------------------------------------------|--------|
| C-001 | HTTP API only | The service exposes a JSON over HTTP API and has no user interface of its own.    | Open   |
| C-002 | Database      | Data is stored in PostgreSQL; schema changes are versioned with Flyway.           | Open   |
