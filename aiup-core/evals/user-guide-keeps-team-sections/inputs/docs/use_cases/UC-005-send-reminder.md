# Use Case: Send Reminder

## Overview

**Use Case ID:** UC-005  
**Use Case Name:** Send Reminder  
**Primary Actor:** Organizer  
**Goal:** Remind the participants of a workshop shortly before it starts so that they attend  
**Trigger:** The organizer prepares a workshop that starts within the next three days  
**Status:** Draft  

**Requirements:** [FR-005](../requirements.md)

## Preconditions

- The organizer is authenticated with the role ORGANIZER

## Main Success Scenario

1. The organizer selects a workshop in the workshop list.
2. The organizer chooses to send a reminder.
3. The system sends an email with the workshop's title and start time to every participant of the workshop.
4. The system shows the message "Reminder sent to <number> participants."

## Alternative Flows

### A1: No Registrations

**Trigger:** The workshop has no registration (step 2)  
**Flow:**

1. The system shows the message "There is no one to remind."
2. Use case ends.

## Postconditions

### Success Postconditions

- Every participant of the workshop has received one reminder email

### Failure Postconditions

- No reminder email is sent

## Business Rules

### BR-001: One Reminder per Workshop

A reminder can be sent only once per workshop.
