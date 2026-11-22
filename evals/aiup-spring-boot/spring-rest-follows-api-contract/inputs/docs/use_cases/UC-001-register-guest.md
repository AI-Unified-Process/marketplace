# Use Case: Register Guest

## Overview

**Use Case ID:** UC-001  
**Use Case Name:** Register Guest  
**Primary Actor:** Booking Portal  
**Goal:** Record a new guest so that the Booking Portal can make a reservation for them  
**Trigger:** A guest without a guest record books a stay on the Booking Portal  
**Status:** Approved  

**Requirements:** [FR-001](../requirements.md)  
**Layers:** API  
**API:** [registerGuest](../api/booking-portal.yaml#registerGuest)

## Preconditions

- The Booking Portal is authenticated as a partner system

## Main Success Scenario

1. The Booking Portal submits a guest registration with first name, last name, email, date of birth, and arrival
   date.
2. The system validates the registration.
3. The system accepts the registration.
4. The system checks the business rules.
5. The system stores the guest and returns the registered guest.

## Alternative Flows

### A1: Email Already Registered

**Trigger:** The email address belongs to another guest (step 4)  
**Flow:**

1. The system rejects the registration with the message "The email address <email> is already registered."
2. Use case ends.

### A2: Guest Too Young

**Trigger:** The guest is younger than eighteen on the arrival date (step 4)  
**Flow:**

1. The system rejects the registration with the message "Guests must be at least 18 years old on the day of arrival."
2. Use case ends.

## Postconditions

### Success Postconditions

- The guest is stored with a registration timestamp

### Failure Postconditions

- No guest is stored

## Business Rules

### BR-001: Required Data

First name, last name, email, date of birth, and arrival date are required.

### BR-002: Unique Email

An email address belongs to at most one guest.

### BR-003: Minimum Age

A guest must be at least eighteen years old on the day of arrival. A guest whose eighteenth birthday is the arrival
date is accepted.
