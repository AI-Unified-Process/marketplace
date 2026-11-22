# Use Case: List Participants

## Overview

**Use Case ID:** UC-003  
**Use Case Name:** List Participants  
**Primary Actor:** Organizer  
**Goal:** See who registered for a workshop so that the organizer can prepare room and materials  
**Trigger:** The organizer prepares a workshop  
**Status:** Tested  

**Requirements:** [FR-003](../requirements.md)

## Preconditions

- The organizer is authenticated with the role ORGANIZER

## Main Success Scenario

1. The organizer selects a workshop in the workshop list.
2. The system shows the workshop's participants with name, email, and registration time, ordered by registration time.
3. The system shows the number of registrations and the free places of the workshop.

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

Only an organizer may see the participants of a workshop.
