# Use Case: Reserve Book

## Overview

**Use Case ID:** UC-021  
**Use Case Name:** Reserve Book  
**Primary Actor:** Member  
**Goal:** The member reserves a book title so the library can lend a copy or put the member on the waiting list.  
**Status:** Approved

**Requirements:** [FR-010](../requirements.md)

## Preconditions

- The member is signed in.
- The Catalog view is reachable at route `catalog`.

## Main Success Scenario

1. The member opens the Catalog view.
2. The system displays the catalog grid with the columns "Title", "Author", and "Available Copies".
3. The member searches for a title and selects it in the grid.
4. The system shows the title's details with a "Reserve" button.
5. The member clicks "Reserve".
6. The system records the reservation with status "Open" and shows the notification "Reservation saved".
7. The system shows the reservation in the member's "My Reservations" list, together with whether a copy is available.

## Alternative Flows

### A1: Title already reserved

**Trigger:** The member already holds an open reservation for the title (step 5)  
**Flow:**

1. The system shows the error "You have already reserved this title".
2. Use case ends.

## Postconditions

### Success Postconditions

- The reservation is recorded with status "Open" for the member and the title.

### Failure Postconditions

- No reservation is recorded.

## Business Rules

### BR-001: One open reservation per title

A member holds at most one open reservation per title.
