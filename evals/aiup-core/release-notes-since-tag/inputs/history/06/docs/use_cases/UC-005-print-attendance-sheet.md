# Use Case: Print Attendance Sheet

## Overview

**Use Case ID:** UC-005  
**Use Case Name:** Print Attendance Sheet  
**Primary Actor:** Organizer  
**Goal:** Print a sheet with the participants of a workshop so that they can sign it on the day  
**Trigger:** The organizer prepares a workshop  
**Status:** Obsolete  

**Requirements:** [FR-005](../requirements.md)

## Preconditions

- The organizer is authenticated with the role ORGANIZER

## Main Success Scenario

1. The organizer selects a workshop in the workshop list.
2. The organizer chooses to print the attendance sheet.
3. The system creates a printable page with the workshop's title and start time and one line per participant with name and an empty signature field, ordered by name.

## Alternative Flows

### A1: No Registrations

**Trigger:** The workshop has no registration (step 2)  
**Flow:**

1. The system shows the message "No one has registered yet."
2. Use case ends.

## Postconditions

### Success Postconditions

- No data is changed

### Failure Postconditions

- _None — the use case only reads data._

## Business Rules

### BR-001: Organizer Only

Only an organizer may print the attendance sheet of a workshop.
