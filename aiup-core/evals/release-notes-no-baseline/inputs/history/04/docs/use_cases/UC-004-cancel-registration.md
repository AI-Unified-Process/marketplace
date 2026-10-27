# Use Case: Cancel Registration

## Overview

**Use Case ID:** UC-004  
**Use Case Name:** Cancel Registration  
**Primary Actor:** Participant  
**Goal:** Give back the reserved place in a workshop so that another participant can take it  
**Trigger:** A participant can no longer attend a workshop they registered for  
**Status:** Tested  

**Requirements:** [FR-004](../requirements.md)

## Preconditions

- The participant has a registration for a workshop that starts in the future

## Main Success Scenario

1. The participant opens the list of their registrations.
2. The system shows each registration with workshop title and start time.
3. The participant selects a registration and chooses to cancel it.
4. The system asks the participant to confirm the cancellation.
5. The participant confirms the cancellation.
6. The system deletes the registration and shows the message "Your registration for <workshop title> is cancelled."

## Alternative Flows

### A1: Cancellation Deadline Passed

**Trigger:** The workshop starts in less than 24 hours (step 5)  
**Flow:**

1. The system rejects the cancellation and keeps the registration.
2. Use case ends.

### A2: Participant Keeps the Registration

**Trigger:** The participant does not confirm the cancellation (step 5)  
**Flow:**

1. The system keeps the registration and shows the list of registrations again.
2. Use case ends.

## Postconditions

### Success Postconditions

- The registration no longer exists
- The free places of the workshop are one more than before

### Failure Postconditions

- The registration is unchanged

## Business Rules

### BR-001: Cancellation Deadline

A registration can be cancelled until 24 hours before the workshop starts.
