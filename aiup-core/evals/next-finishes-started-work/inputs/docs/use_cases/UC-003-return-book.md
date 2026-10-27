# Use Case: Return Book

## Overview

**Use Case ID:** UC-003  
**Use Case Name:** Return Book  
**Primary Actor:** Librarian  
**Goal:** Librarian records the return of a copy so that it can be lent again  
**Status:** Implemented

**Requirements:** [FR-003](../requirements.md)

## Preconditions

- Librarian is logged into the system

## Main Success Scenario

1. Librarian scans the copy.
2. System displays the open loan of the copy with its due date.
3. System records the return and marks the copy as available.

## Alternative Flows

### A1: Returned Late

**Trigger:** The return date is after the due date of the loan (step 2)
**Flow:**

1. System calculates the late fee per BR-001 and displays it.
2. Librarian collects the late fee.
3. Use case continues at step 3.

### A2: No Open Loan

**Trigger:** The copy has no open loan (step 2)
**Flow:**

1. System displays that the copy is not on loan.
2. Use case ends.

## Postconditions

### Success Postconditions

- The loan has a return date, and a late fee when the copy came back late
- The copy is available

### Failure Postconditions

- The loan stays open

## Business Rules

### BR-001: Late Fee

A copy returned after its due date (UC-002 BR-002) costs CHF 0.50 for each day late.
