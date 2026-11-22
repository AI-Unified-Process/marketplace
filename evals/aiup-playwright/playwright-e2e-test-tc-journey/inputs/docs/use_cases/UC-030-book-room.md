# Use Case: Book Room

## Overview

**Use Case ID:** UC-030  
**Use Case Name:** Book Room  
**Primary Actor:** Front Desk Agent  
**Goal:** Reserve a room type for a registered guest so that a room is held for their stay  
**Trigger:** A registered guest asks the front desk for a room  
**Status:** Implemented  

## Preconditions

- The guest is registered
- The room type exists

## Main Success Scenario

1. The front desk agent opens "Reservations" and clicks "New Reservation".
2. The front desk agent selects the guest and the room type and enters arrival and departure dates.
3. The front desk agent clicks "Confirm".
4. The system creates the reservation.
5. The system confirms with the message "Reservation confirmed."

## Alternative Flows

### A1: Departure Not After Arrival

**Trigger:** The departure date is not after the arrival date (step 3)  
**Flow:**

1. The system rejects the reservation with the message "Departure must be after arrival."
2. Use case continues at step 2.

## Postconditions

### Success Postconditions

- A reservation for the guest and room type exists

### Failure Postconditions

- No reservation is created

## Business Rules

### BR-001: Departure After Arrival

The departure date of a reservation is after its arrival date.
