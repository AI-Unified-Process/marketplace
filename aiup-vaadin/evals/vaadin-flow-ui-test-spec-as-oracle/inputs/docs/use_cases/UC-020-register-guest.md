# Use Case: Register Guest

## Overview

**Use Case ID:** UC-020  
**Use Case Name:** Register Guest  
**Primary Actor:** Front Desk Agent  
**Goal:** Register a new guest so that the front desk can assign them to a reservation  
**Trigger:** A guest who is not yet registered arrives at the front desk  
**Status:** Implemented  

**Requirements:** [FR-004](../requirements.md)

## Preconditions

- The front desk agent is logged in

## Main Success Scenario

1. The front desk agent opens the Guests view.
2. The system lists the registered guests with first name, last name, and email.
3. The front desk agent enters the guest's first name, last name, email, and date of birth and clicks "Register".
4. The system creates the guest record.
5. The system shows the message "Guest registered" and lists the new guest.

## Alternative Flows

### A1: Email Already Registered

**Trigger:** The email already belongs to another guest (step 4)  
**Flow:**

1. The system shows the message "Email already registered" and keeps the entered values.
2. Use case continues at step 3.

### A2: Guest Too Young

**Trigger:** The date of birth makes the guest younger than eighteen years on the day of registration (step 3)  
**Flow:**

1. The system marks the date of birth with "The guest must be at least 18 years old" and does not register the guest.
2. Use case continues at step 3.

## Postconditions

### Success Postconditions

- A new guest record exists and can be assigned to a reservation

### Failure Postconditions

- No guest record is created

## Business Rules

### BR-001: Guest Email Must Be Unique

No two guest records may share the same email address.

### BR-002: Guests Are Adults

A guest must be at least eighteen years old on the day of registration.
