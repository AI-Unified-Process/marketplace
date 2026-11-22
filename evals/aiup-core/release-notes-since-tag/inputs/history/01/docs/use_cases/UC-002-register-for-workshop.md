# Use Case: Register for Workshop

## Overview

**Use Case ID:** UC-002  
**Use Case Name:** Register for Workshop  
**Primary Actor:** Participant  
**Goal:** Reserve a place in an upcoming workshop so that the participant can attend it  
**Trigger:** A participant decides to attend a workshop  
**Status:** Tested  

**Requirements:** [FR-002, NFR-001](../requirements.md)

## Preconditions

- At least one workshop that starts in the future exists

## Main Success Scenario

1. The participant opens the list of upcoming workshops.
2. The system shows each upcoming workshop with title, start time, and free places.
3. The participant selects a workshop and enters name and email.
4. The participant confirms the registration.
5. The system stores the registration and shows the message "You are registered for <workshop title>."

## Alternative Flows

### A1: Workshop Fully Booked

**Trigger:** The workshop has no free place left (step 4)  
**Flow:**

1. The system shows the message "This workshop is fully booked."
2. Use case ends.

### A2: Registration Closed

**Trigger:** The workshop starts in less than 24 hours (step 4)  
**Flow:**

1. The system shows the message "Registration for this workshop has closed."
2. Use case ends.

### A3: Already Registered

**Trigger:** A registration with the same email exists for the workshop (step 4)  
**Flow:**

1. The system shows the message "You are already registered for this workshop."
2. Use case ends.

## Postconditions

### Success Postconditions

- A registration with the participant's name, email, and the time of registration exists for the workshop
- The free places of the workshop are one less than before

### Failure Postconditions

- No registration is stored

## Business Rules

### BR-001: Capacity

A workshop accepts registrations only while the number of its registrations is less than its capacity.

### BR-002: Registration Deadline

Registration for a workshop closes 24 hours before the workshop starts.

### BR-003: One Registration per Email

A participant email can be registered only once for the same workshop.
