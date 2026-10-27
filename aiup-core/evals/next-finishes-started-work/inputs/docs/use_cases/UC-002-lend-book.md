# Use Case: Lend Book

## Overview

**Use Case ID:** UC-002  
**Use Case Name:** Lend Book  
**Primary Actor:** Librarian  
**Goal:** Librarian lends a copy to a member and the loan is recorded  
**Status:** Implemented

**Requirements:** [FR-002, NFR-001](../requirements.md)

## Preconditions

- Librarian is logged into the system
- The member is registered

## Main Success Scenario

1. Librarian scans the membership card.
2. System displays the member and the copies currently on loan.
3. Librarian scans the copy.
4. System checks that the copy is available.
5. Librarian confirms the loan.
6. System records the loan and displays the due date.

## Alternative Flows

### A1: Member Not Found

**Trigger:** No member has the scanned member number (step 2)
**Flow:**

1. System displays that the member number is unknown.
2. Use case continues at step 1.

### A2: Loan Limit Reached

**Trigger:** The member already has five copies on loan (step 2)
**Flow:**

1. System displays the loan limit and the copies on loan.
2. Use case ends.

### A3: Copy Not Available

**Trigger:** The copy is recorded as on loan (step 4)
**Flow:**

1. System displays that the copy is on loan and its due date.
2. Use case continues at step 3.

## Postconditions

### Success Postconditions

- A loan for the member and the copy is recorded with loan date and due date
- The copy is no longer available

### Failure Postconditions

- No loan is recorded

## Business Rules

### BR-001: Loan Limit

A member may have at most five copies on loan at the same time.

### BR-002: Loan Period

The due date is 28 days after the loan date.
