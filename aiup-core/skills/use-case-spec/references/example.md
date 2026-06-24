# Example Use Case Specification

A complete, worked example. Use it to see how the [template](use-case.md)
is filled in — actor-focused steps, alternative flows that reference specific step
numbers, and paired success/failure postconditions. When several use cases are
written together, `BR-XXX` IDs continue across files (the next use case would start
at `BR-004` here), and never restart at `BR-001`.

---

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
