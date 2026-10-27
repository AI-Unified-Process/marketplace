# Requirements Catalog — City Library

**Last updated:** 2026-09-15

## Functional Requirements

| ID     | Title           | User Story                                                                                         | Priority | Status      |
|--------|-----------------|----------------------------------------------------------------------------------------------------|----------|-------------|
| FR-001 | Register Member | As a librarian, I want to register members so that they can borrow books.                          | High     | Implemented |
| FR-002 | Lend Book       | As a librarian, I want to lend a copy of a book to a member so that the loan is recorded.          | High     | Implemented |
| FR-003 | Return Book     | As a librarian, I want to record the return of a copy so that it can be lent again.                | High     | Implemented |
| FR-004 | Search Catalog  | As a member, I want to search the catalog by title and author so that I find the books I want.     | High     | Implemented |

## Non-Functional Requirements

| ID      | Title               | Requirement                                                                                                   | Category     | Priority | Status |
|---------|---------------------|---------------------------------------------------------------------------------------------------------------|--------------|----------|--------|
| NFR-001 | Counter availability | Lending and returning at the counter are available Monday to Saturday from 08:00 to 20:00 with 99.5 % availability. | Availability | High     | Open   |
| NFR-002 | Catalog search time | A catalog search returns its first page of results within 1 second for a catalog of 500,000 titles.          | Performance  | High     | Open   |

## Constraints

| ID    | Title    | Constraint                                                                              | Category  | Status |
|-------|----------|-----------------------------------------------------------------------------------------|-----------|--------|
| C-001 | Database | Data is stored in PostgreSQL 16; schema changes are versioned with Flyway.              | Technical | Open   |
| C-002 | Sign-in  | Members and librarians sign in through the city's single sign-on (OpenID Connect).      | Technical | Open   |
