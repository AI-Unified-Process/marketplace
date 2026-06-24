# Library Management System — Requirements Catalog

## Functional Requirements (FR)

| ID     | Requirement                                                                                                 | Priority | Status   |
|--------|-------------------------------------------------------------------------------------------------------------|----------|----------|
| FR-001 | As a Library Member, I want to search the catalog by title, author, or ISBN so that I can find available books quickly. | High | Approved |
| FR-002 | As a Library Member, I want to borrow a book so that I can take it home and read it.                        | High     | Approved |
| FR-003 | As a Library Member, I want to return a borrowed book so that other members can access it.                  | High     | Approved |
| FR-004 | As a Library Member, I want to renew my loan so that I can keep a book for longer without returning it first. | Medium | Approved |
| FR-005 | As a Library Member, I want to place a reservation on a book that is currently on loan so that I am notified when it becomes available. | Medium | Approved |
| FR-006 | As a Librarian, I want to register new books into the catalog so that members can discover and borrow them.  | High     | Approved |
| FR-007 | As a Librarian, I want to process overdue book returns and apply fines so that the borrowing policy is enforced. | High | Approved |
| FR-008 | As a Librarian, I want to manage member accounts (create, update, deactivate) so that access to library services is controlled. | High | Approved |

## Non-Functional Requirements (NFR)

| ID      | Category        | Requirement                                                              | Priority | Status   |
|---------|-----------------|--------------------------------------------------------------------------|----------|----------|
| NFR-001 | Performance     | The catalog search must return results within 2 seconds for up to 50,000 books. | High | Approved |
| NFR-002 | Availability    | The system must be available 99.5% of the time during library opening hours (8:00–22:00). | High | Approved |
| NFR-003 | Security        | Member passwords must be stored using bcrypt hashing with a minimum cost factor of 12. | High | Approved |
| NFR-004 | Usability       | A new member must be able to complete a book search and reservation within 3 minutes without assistance. | Medium | Approved |

## Constraints

| ID    | Constraint                                                                                   | Status   |
|-------|----------------------------------------------------------------------------------------------|----------|
| C-001 | The system must run on-premises using the library's existing Linux servers.                  | Approved |
| C-002 | The system must comply with GDPR requirements for storing personally identifiable information. | Approved |
| C-003 | The maximum loan period is 21 days; members may renew a loan up to 2 times.                  | Approved |
