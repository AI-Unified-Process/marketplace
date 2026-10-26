# Use Case: Manage Workshops

## Overview

**Use Case ID:** UC-001  
**Use Case Name:** Manage Workshops  
**Primary Actor:** Organizer  
**Goal:** Create or change a workshop so that participants can register for it  
**Trigger:** The organizer plans a new workshop or changes a planned one  
**Status:** Tested  

**Requirements:** [FR-001](../requirements.md)

## Preconditions

- The organizer is authenticated with the role ORGANIZER

## Main Success Scenario

1. The organizer opens the workshop list.
2. The system shows all workshops ordered by start time.
3. The organizer chooses to create a workshop and enters title, start time, and capacity.
4. The organizer saves the workshop.
5. The system stores the workshop and shows it in the list.

## Alternative Flows

### A1: Edit Existing Workshop

**Trigger:** The organizer selects a workshop in the list (step 3)  
**Flow:**

1. The system shows the workshop's title, start time, and capacity in the form.
2. The organizer changes the values.
3. Use case continues at step 4.

## Postconditions

### Success Postconditions

- The workshop is stored with the entered title, start time, and capacity

### Failure Postconditions

- No workshop is created or changed

## Business Rules

### BR-001: Start in the Future

A workshop must start in the future when it is saved.
