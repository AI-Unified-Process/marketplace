# Use Case: Find Guest

## Overview

**Use Case ID:** UC-021  
**Use Case Name:** Find Guest  
**Primary Actor:** Front Desk Agent  
**Goal:** Find a registered guest by last name so that the front desk can check their details  
**Trigger:** A guest gives their name at the front desk  
**Status:** Implemented  

**Requirements:** [FR-005](../requirements.md)

## Preconditions

- The front desk agent is logged in

## Main Success Scenario

1. The front desk agent opens the Guests view.
2. The front desk agent enters a last name in "Search by last name".
3. The system lists only the guests whose last name starts with the entered text, with first name, last name, and email.

## Alternative Flows

### A1: No Guest Found

**Trigger:** No guest's last name starts with the entered text (step 3)  
**Flow:**

1. The system shows "No guests found" in place of the list.
2. Use case ends.

## Postconditions

### Success Postconditions

- The front desk agent sees the guests whose last name starts with the entered text

### Failure Postconditions

- No guest record is changed

## Business Rules

### BR-001: Search Ignores Case

The search matches last names regardless of upper and lower case.
