# Requirements Catalog — Community Garden

**Last updated:** 2026-10-20

## Functional Requirements

| ID     | Title               | User Story                                                                                                                  | Priority | Status |
|--------|---------------------|-----------------------------------------------------------------------------------------------------------------------------|----------|--------|
| FR-001 | Assign garden plots | As a garden coordinator, I want to assign a plot to a gardener for the current season so that every plot is worked by one gardener. | Must     | Open   |

## Non-Functional Requirements

| ID      | Title        | Requirement                                              | Category  | Priority | Status |
|---------|--------------|----------------------------------------------------------|-----------|----------|--------|
| NFR-001 | Note length  | A note on a plot assignment has at most 200 characters.  | Usability | Must     | Open   |

## Constraints

| ID    | Title    | Constraint                                                                                      | Category    | Priority | Status |
|-------|----------|-------------------------------------------------------------------------------------------------|-------------|----------|--------|
| C-001 | Database | Data is stored in PostgreSQL; schema changes are versioned with Flyway.                         | Technical   | Must     | Open   |
| C-002 | Access   | The application runs on the computer of the garden office without sign-in; there are no user roles. | Operational | Must     | Open   |
