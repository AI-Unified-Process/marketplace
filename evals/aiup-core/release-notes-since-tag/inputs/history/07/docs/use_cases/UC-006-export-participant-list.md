# Use Case: Export Participant List

## Overview

**Use Case ID:** UC-006  
**Use Case Name:** Export Participant List  
**Primary Actor:** Organizer  
**Goal:** Take the participants of a workshop out of the system so that the organizer can print an attendance sheet  
**Trigger:** The organizer prepares the attendance sheet of a workshop  
**Status:** Done  

**Requirements:** [FR-005](../requirements.md)

## Preconditions

- The organizer is authenticated with the role ORGANIZER

## Main Success Scenario

1. The organizer selects a workshop in the workshop list.
2. The organizer chooses to export the participants.
3. The system creates a CSV file with name, email, and registration time of every participant, ordered by name.
4. The system offers the file for download.

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

Only an organizer may export the participants of a workshop.
