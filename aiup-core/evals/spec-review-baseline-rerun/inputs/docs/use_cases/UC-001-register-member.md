# Use Case: Register Member

## Overview

**Use Case ID:** UC-001  
**Use Case Name:** Register Member  
**Primary Actor:** Librarian  
**Goal:** Librarian registers a new member so that the member can borrow copies  
**Status:** Reviewed

**Requirements:** [FR-001](../requirements.md)

## Preconditions

- Librarian is logged into the system

## Main Success Scenario

1. Librarian opens the member registration.
2. Librarian enters the name, email address, and date of birth of the customer.
3. System verifies that no member with this email address exists.
4. System registers the member and displays the member number.

## Alternative Flows

### A1: Email Address Already Registered

**Trigger:** A member with this email address already exists (step 3)
**Flow:**

1. System displays the existing member.
2. Use case ends.

### A2: Member Too Young

**Trigger:** The date of birth is less than 16 years before today (step 3)
**Flow:**

1. System rejects the registration and names the minimum age.
2. Use case ends.

## Postconditions

### Success Postconditions

- The member is registered and can borrow copies

### Failure Postconditions

- No member is registered

## Business Rules

### BR-001: Minimum Age

A member must be at least 16 years old on the day of registration.

### BR-002: Loan Limit

A member may borrow at most five copies at the same time.

### BR-003: Loan Period

A copy is lent for 14 days; the due date is 14 days after the loan date.
