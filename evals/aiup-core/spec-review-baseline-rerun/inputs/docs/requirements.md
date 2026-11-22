# Requirements

## Functional Requirements

| ID     | Title          | User Story                                                                                            | Priority | Status |
|--------|----------------|-------------------------------------------------------------------------------------------------------|----------|--------|
| FR-001 | Register Member | As a librarian, I want to register members so that they can borrow books.                            | High     | Open   |
| FR-002 | Lend Book       | As a librarian, I want to lend a copy of a book to a member so that the loan is recorded.            | High     | Open   |
| FR-003 | Return Book     | As a librarian, I want to record the return of a copy so that it can be lent again.                  | High     | Open   |
| FR-004 | Send Reminder   | As a member, I want a reminder before my loan is due so that I avoid late fees.                      | Medium   | Open   |

## Non-Functional Requirements

| ID      | Title         | Requirement                                                   | Category    | Priority | Status |
|---------|---------------|---------------------------------------------------------------|-------------|----------|--------|
| NFR-001 | Response Time | The loan screen must respond fast, even with many loans open. | Performance | High     | Open   |

## Constraints

| ID    | Title    | Constraint                     | Category  | Priority | Status |
|-------|----------|--------------------------------|-----------|----------|--------|
| C-001 | Database | System must use PostgreSQL 16. | Technical | High     | Open   |
