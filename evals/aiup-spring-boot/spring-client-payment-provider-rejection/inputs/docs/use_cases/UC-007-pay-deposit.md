# Use Case: Pay Deposit

## Overview

**Use Case ID:** UC-007  
**Use Case Name:** Pay Deposit  
**Primary Actor:** Receptionist  
**Secondary Actors:** Payment Provider  
**Goal:** Secure a reservation by charging its deposit to the guest's card  
**Trigger:** A guest confirms a reservation by phone and agrees to pay the deposit  
**Status:** Approved  

**Requirements:** [FR-007](../requirements.md)

## Preconditions

- The receptionist is logged in
- The booking is confirmed and has a card token of the guest's card

## Main Success Scenario

1. The receptionist opens the booking.
2. The receptionist selects "Charge deposit".
3. The system charges the deposit to the guest's card at the payment provider, with the booking id as reference.
4. The system stores the payment provider's charge id on the booking, marks the deposit as paid, and shows the
   confirmation "Deposit charged."

## Alternative Flows

### A1: Payment Declined

**Trigger:** The payment provider declines the card (step 3)  
**Flow:**

1. The system shows the message "The payment was declined. Please use another card."
2. Use case ends; the deposit stays unpaid.

### A2: Payment Provider Unavailable

**Trigger:** The payment provider does not answer or reports that it is unavailable (step 3)  
**Flow:**

1. The system shows the message "The payment service is not available. Please try again later."
2. Use case ends; the deposit stays unpaid.

## Postconditions

### Success Postconditions

- The booking holds the charge id and its deposit is paid

### Failure Postconditions

- The deposit of the booking is unpaid

## Business Rules

### BR-001: Deposit Amount

The deposit is 30 percent of the booking's total price, rounded to two decimal places, in the booking's currency.

### BR-002: One Deposit per Booking

A booking whose deposit is paid is not charged again.
