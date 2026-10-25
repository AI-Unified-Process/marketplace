# Use Case: Register Guest

## Overview

**Use Case ID:** UC-020  
**Use Case Name:** Register Guest  
**Primary Actor:** Front Desk Agent  
**Goal:** Register a new guest so they can be assigned to a reservation  
**Trigger:** A new guest arrives at the front desk or calls to book  
**Status:** Approved  

**Requirements:** [FR-011](../requirements.md)

## Preconditions

- The front desk agent is logged in

## Main Success Scenario

1. The front desk agent enters the guest's first name, last name, and email.
2. The system creates the guest record.
3. The system confirms the guest was registered.

## Alternative Flows

### A1: Email Already Registered

**Trigger:** The email address already belongs to another guest (step 2)  
**Flow:**

1. The system rejects the registration with an error message.
2. Use case continues at step 1.

## Postconditions

### Success Postconditions

- A new guest record exists and can be assigned to a reservation

### Failure Postconditions

- No guest record is created

## Business Rules

### BR-001: Guest Email Must Be Unique

No two guest records may share the same email address.
