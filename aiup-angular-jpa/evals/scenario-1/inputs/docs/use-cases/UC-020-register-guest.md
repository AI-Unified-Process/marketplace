**Use Case ID:** UC-020
**Name:** Register Guest
**Primary Actor:** Front Desk Agent
**Goal:** Register a new guest so they can be assigned to a reservation
**Status:** Approved

## Preconditions

- The front desk agent is logged in

## Main Success Scenario

1. The front desk agent enters the guest's first name, last name, and email
2. The system creates the guest record
3. The system confirms the guest was registered

## Alternative Flows

### A1: Email Already Registered

1. The front desk agent submits an email address that already belongs to another guest
2. The system rejects the registration with an error message

## Postconditions

- A new guest record exists and can be assigned to a reservation

## Business Rules

### BR-020: Guest Email Must Be Unique

No two guest records may share the same email address.
