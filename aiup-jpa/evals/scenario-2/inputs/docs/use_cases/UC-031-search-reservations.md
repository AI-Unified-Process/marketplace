# Use Case: Search Reservations

## Overview

**Use Case ID:** UC-031  
**Use Case Name:** Search Reservations  
**Primary Actor:** Front Desk Agent  
**Goal:** Find the reservations arriving in a period to prepare the check-ins  
**Trigger:** The front desk agent wants to prepare the check-ins of a period  
**Status:** Approved  

**Requirements:** [FR-012](../requirements.md)

## Preconditions

- The front desk agent is logged in

## Main Success Scenario

1. The front desk agent enters a from date and a to date.
2. The system lists the reservations whose arrival date lies between the from date and the to date, both included, showing the guest's last name and first name, the room type name, the arrival date, and the departure date.
3. The system sorts the list by arrival date, then by the guest's last name.

## Alternative Flows

### A1: No Reservations in the Period

**Trigger:** The system finds no reservation for the period (step 2)  
**Flow:**

1. The system shows the message "No reservations arrive in this period."
2. Use case ends.

## Postconditions

### Success Postconditions

- The front desk agent has seen the reservations arriving in the period

### Failure Postconditions

- No data is changed

## Business Rules

### BR-001: Cancelled Reservations Are Not Listed

A reservation with status CANCELLED never appears in the search result.
