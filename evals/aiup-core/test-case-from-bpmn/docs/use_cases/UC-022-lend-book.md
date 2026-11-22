# Use Case: Lend Book

## Overview

**Use Case ID:** UC-022  
**Use Case Name:** Lend Book  
**Primary Actor:** Librarian  
**Goal:** The librarian lends an available copy to the member who reserved the title.  
**Status:** Approved

## Preconditions

- The librarian is signed in.
- An open reservation exists for a title with at least one available copy.
- The Reservations view is reachable at route `reservations`.

## Main Success Scenario

1. The librarian opens the Reservations view.
2. The system displays the open reservations with the columns "Member", "Title", and "Reserved On".
3. The librarian selects the reservation and clicks "Lend".
4. The system opens a dialog showing the available copies of the title and the due date, 28 days from today.
5. The librarian selects a copy and clicks "Confirm".
6. The system records the loan, sets the reservation's status to "Fulfilled", sets the copy's status to "On Loan", and shows the notification "Book lent".

## Alternative Flows

### A1: No copy available

**Trigger:** The title has no available copy when the librarian clicks "Lend" (step 3)  
**Flow:**

1. The system shows the error "No copy of this title is available".
2. Use case ends.

## Postconditions

### Success Postconditions

- A loan exists for the member and the copy; the reservation is "Fulfilled" and the copy is "On Loan".

### Failure Postconditions

- No loan is recorded; the reservation stays "Open".

## Business Rules

### BR-001: Loan period

A loan is due 28 days after it was recorded.
