# Test Case: Lend and Return a Copy

## Overview

**ID:** TC-001  
**Goal:** A librarian lends a copy to a member and records its late return, and the late fee is charged  
**Priority:** High  
**Status:** Reviewed  
**Process:** [BP-001](../processes/BP-001-loan-cycle.bpmn)

## Roles

- Librarian (lends the copy and records its return)

## Preconditions

- Member 1001 "Anna Keller" is registered and has no copies on loan (Flyway test data `V900__test_data.sql`)
- Copy 5001 "The Trial" is available

## Flow

| Step | Name              | Description                                                          | Test Data            | Use Case                                   |
|------|-------------------|----------------------------------------------------------------------|----------------------|--------------------------------------------|
| 1    | Lend the copy     | Librarian scans the member card and the copy and confirms the loan   | 1001, 5001, 2026-11-02 | [UC-002](../use_cases/UC-002-lend-book.md)   |
| 2    | Verify due date   | System shows the due date 2026-11-30                                 | -                    | -                                          |
| 3    | Return late       | Librarian scans the copy two days after the due date                 | 5001, 2026-12-02     | [UC-003](../use_cases/UC-003-return-book.md) |
| 4    | Verify late fee   | System shows a late fee of CHF 1.00                                  | -                    | -                                          |

## Validation

1. **Copy available again**: Copy 5001 is shown as available.
2. **Fee recorded**: The loan of copy 5001 shows the return date 2026-12-02 and the late fee CHF 1.00.

## Postconditions

- One closed loan for member 1001 and copy 5001 with a late fee
