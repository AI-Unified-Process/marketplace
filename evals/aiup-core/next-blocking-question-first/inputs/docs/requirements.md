# Requirements Catalog — City Library

**Last updated:** 2026-09-15

## Functional Requirements

| ID     | Title           | User Story                                                                                     | Priority | Status      |
|--------|-----------------|------------------------------------------------------------------------------------------------|----------|-------------|
| FR-001 | Register Member | As a librarian, I want to register members so that they can borrow books.                      | High     | Open        |
| FR-002 | Lend Book       | As a librarian, I want to lend a copy of a book to a member so that the loan is recorded.      | High     | Implemented |
| FR-003 | Return Book     | As a librarian, I want to record the return of a copy so that it can be lent again.            | High     | Implemented |
| FR-004 | Send Reminder   | As a member, I want a reminder before my loan is due so that I avoid late fees.                | Medium   | Open        |

## Non-Functional Requirements

| ID      | Title         | Requirement                                                                              | Category    | Priority | Status |
|---------|---------------|------------------------------------------------------------------------------------------|-------------|----------|--------|
| NFR-001 | Response Time | The lend screen shows the member and the copies on loan within 2 seconds of the scan.    | Performance | High     | Implemented |

## Constraints

| ID    | Title    | Constraint                                                                 | Category  | Priority | Status |
|-------|----------|----------------------------------------------------------------------------|-----------|----------|--------|
| C-001 | Database | Data is stored in PostgreSQL 16; schema changes are versioned with Flyway. | Technical | High     | Open   |
