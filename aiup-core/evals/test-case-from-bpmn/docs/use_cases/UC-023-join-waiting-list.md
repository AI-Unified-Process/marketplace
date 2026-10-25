# Use Case: Join Waiting List

## Overview

**Use Case ID:** UC-023  
**Use Case Name:** Join Waiting List  
**Primary Actor:** Member  
**Goal:** The member joins the waiting list of a reserved title that has no available copy.  
**Status:** Approved

## Preconditions

- The member is signed in.
- The member holds an open reservation for a title without an available copy.

## Main Success Scenario

1. The member opens "My Reservations".
2. The system shows the open reservation with the hint "No copy available" and a "Join Waiting List" button.
3. The member clicks "Join Waiting List".
4. The system adds the member to the end of the title's waiting list, sets the reservation's status to "Waiting", and shows the notification "You are number N on the waiting list".

## Alternative Flows

### A1: Copy became available

**Trigger:** A copy of the title became available before the member clicks "Join Waiting List" (step 3)  
**Flow:**

1. The system shows the hint "A copy is available — the library will lend it to you" and hides the button.
2. Use case ends.

## Postconditions

### Success Postconditions

- The member is on the title's waiting list and the reservation is "Waiting".

### Failure Postconditions

- The waiting list is unchanged; the reservation stays "Open".

## Business Rules

### BR-001: Waiting list order

The waiting list is served first come, first served.
