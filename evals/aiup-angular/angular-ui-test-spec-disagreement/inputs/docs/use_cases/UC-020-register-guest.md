# Use Case: Register Guest

## Overview

**Use Case ID:** UC-020  
**Use Case Name:** Register Guest  
**Primary Actor:** Front Desk Agent  
**Goal:** Register a new guest so that the front desk can assign them to a reservation  
**Trigger:** A guest who is not yet registered arrives at the front desk  
**Status:** Implemented  

## Preconditions

- The front desk agent is logged in

## Main Success Scenario

1. The front desk agent enters the guest's first name, last name, and email.
2. The front desk agent submits the registration.
3. The system creates the guest record.
4. The system confirms with the message "Guest registered."

## Alternative Flows

### A1: Email Already Registered

**Trigger:** The email address already belongs to another guest (step 3)  
**Flow:**

1. The system rejects the registration with the message "This email address is already registered."
2. Use case continues at step 1.

### A2: Required Field Missing

**Trigger:** The first name, last name, or email is empty (step 2)  
**Flow:**

1. The system does not submit the registration and marks the empty field as required.
2. Use case continues at step 1.

## Postconditions

### Success Postconditions

- A new guest record exists and can be assigned to a reservation

### Failure Postconditions

- No guest record is created

## Business Rules

### BR-001: Guest Email Must Be Unique

No two guest records may share the same email address.

### BR-002: Name and Email Are Required

A guest is registered only with a first name, a last name, and an email address.
