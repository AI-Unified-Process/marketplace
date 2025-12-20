---
name: use-case-specification
description: Creates use case specifications with structured scenarios and business rules.
---

# Use Case Specification Writer

## Instructions

Create or update use case specification documents in `docs/use_cases/`. Each use case describes a complete interaction
between an actor and the system to achieve a goal.

## DO NOT

- Write vague or incomplete scenarios
- Skip numbering steps in the Main Success Scenario
- Omit alternative flows for error conditions
- Leave postconditions undefined
- Mix multiple use cases in one document
- Use technical implementation details in the flow steps

## Template

Use [templates/use-case.md](templates/use-case.md) as the document structure.

## Example Use Case

# Use Case: Create Reservation

## Overview

**Use Case ID:** UC-001
**Use Case Name:** Create Reservation
**Primary Actor:** Front Desk Clerk
**Goal:** Create a new room reservation for a guest
**Status:** Approved

## Preconditions

- Clerk is logged into the system
- At least one room type is available for the requested dates

## Main Success Scenario

1. Clerk selects "New Reservation" from the menu.
2. System displays the reservation form.
3. Clerk enters guest information (name, email, phone).
4. Clerk selects check-in and check-out dates.
5. System displays available room types for the selected dates.
6. Clerk selects a room type.
7. System calculates the total price.
8. Clerk confirms the reservation.
9. System creates the reservation and displays a confirmation number.

## Alternative Flows

### A1: Guest Already Exists

**Trigger:** Guest email matches existing record (step 3)
**Flow:**

1. System displays existing guest information.
2. Clerk confirms or updates guest details.
3. Use case continues at step 4.

### A2: No Rooms Available

**Trigger:** No rooms available for selected dates (step 5)
**Flow:**

1. System displays "No availability" message.
2. Clerk adjusts dates or cancels operation.
3. Use case continues at step 4 or ends.

### A3: Payment Required

**Trigger:** Business rule requires deposit (step 8)
**Flow:**

1. System prompts for payment information.
2. Clerk enters payment details.
3. System processes payment.
4. Use case continues at step 9.

## Postconditions

### Success Postconditions

- Reservation is stored in the system with status "Confirmed"
- Room availability is updated for the reserved dates
- Confirmation email is sent to the guest

### Failure Postconditions

- No reservation is created
- Room availability remains unchanged
- System displays error message to clerk

## Business Rules

### BR-001: Minimum Stay

Reservations must be for at least one night.

### BR-002: Advance Booking Limit

Reservations cannot be made more than 365 days in advance.

### BR-003: Deposit Requirement

Reservations of 3 or more nights require a 50% deposit.

## Status Reference

| Status   | Description                                      |
|----------|--------------------------------------------------|
| Draft    | Initial version, still being written.            |
| Review   | Complete, awaiting stakeholder review.           |
| Approved | Reviewed and approved for implementation.        |
| Obsolete | No longer valid, superseded by another use case. |

## Step Writing Guidelines

| Do                                  | Don't                                         |
|-------------------------------------|-----------------------------------------------|
| "User clicks Save button"           | "User triggers onClick handler"               |
| "System validates the email format" | "System runs regex /^[\w]+@[\w]+$/"           |
| "System displays error message"     | "System throws ValidationException"           |
| "User enters check-in date"         | "User populates dateField component"          |
| "System stores the reservation"     | "System executes INSERT INTO reservations..." |

## Workflow

1. Read the requirements document and use case diagram
2. Identify the use case to document
3. Use TodoWrite to track progress
4. Write the Overview section with actor and goal
5. Define preconditions (what must be true before starting)
6. Write the Main Success Scenario step by step
7. Identify alternative flows:
    - Error conditions
    - Optional paths
    - Exceptional situations
8. Define postconditions for both success and failure
9. Document applicable business rules
10. Review for completeness and clarity
11. Mark todo complete
