# Use Case: Register Guest

## Overview

**Use Case ID:** UC-003  
**Use Case Name:** Register Guest  
**Primary Actor:** Receptionist  
**Goal:** Record a new guest so that rooms can be reserved for them  
**Trigger:** A guest arrives at the front desk without a guest record  
**Status:** Approved  

**Requirements:** [FR-004](../requirements.md)

## Preconditions

- The receptionist is signed in

## Main Success Scenario

1. The receptionist opens the guest registration form.
2. The receptionist enters first name, last name, email, and birth date.
3. The system validates the input and stores the guest.
4. The system shows the new guest in the guest list.

## Alternative Flows

### A1: Email Already Registered

**Trigger:** A guest with the same email address already exists (step 3)  
**Flow:**

1. The system shows "A guest with this email address is already registered" and stores nothing.
2. Use case continues at step 2.

## Postconditions

### Success Postconditions

- The guest is stored and can be selected for a reservation

### Failure Postconditions

- No guest is stored

## Business Rules

### BR-001: One Guest per Email Address

An email address belongs to one guest only.
