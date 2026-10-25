# Use Case: Lend Book

## Overview

**Use Case ID:** UC-002  
**Use Case Name:** Lend Book  
**Primary Actor:** Librarian  
**Goal:** Librarian lends a copy to a member and the loan is recorded  
**Status:** Reviewed

**Requirements:** [FR-002, FR-009](../requirements.md)

## Preconditions

- Librarian is logged into the system
- The member is registered (see UC-001 BR-001)

## Main Success Scenario

1. Librarian enters the member number.
2. System displays the member and the copies currently on loan.
3. Librarian scans the copy.
4. System checks that the copy is available.
5. Librarian clicks the green "Lend" button in the top right corner.
6. System records the loan and displays the due date.

## Alternative Flows

### A1: Member Not Found

**Trigger:** No member has the entered member number (step 2)
**Flow:**

1. System displays that the member number is unknown.
2. Use case continues at step 1.

### A2: Loan Limit Reached

**Trigger:** The member already has the maximum number of copies on loan (step 2)
**Flow:**

1. System displays the loan limit and the copies on loan.
2. Use case ends.

## Postconditions

### Success Postconditions

- A loan for the member and the copy is recorded with loan date and due date
- The copy is no longer available

### Failure Postconditions

- No loan is recorded

## Business Rules

### BR-001: Maximum Loans

No more than 5 items can be on loan to one member simultaneously.

### BR-002: Due Date

The due date is 28 days after the loan date.
