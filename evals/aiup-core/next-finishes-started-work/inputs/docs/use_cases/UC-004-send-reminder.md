# Use Case: Send Reminder

## Overview

**Use Case ID:** UC-004  
**Use Case Name:** Send Reminder  
**Primary Actor:** Librarian  
**Goal:** Librarian sends the reminders for the loans that are due soon so that members return their copies on time  
**Status:** Approved

**Requirements:** [FR-004](../requirements.md)

## Preconditions

- Librarian is logged into the system

## Main Success Scenario

1. Librarian opens the reminder list.
2. System lists the open loans that are due for a reminder per BR-001.
3. Librarian sends the reminders.
4. System emails each member a reminder with the title and the due date of the copy.

## Alternative Flows

### A1: No Reminder Due

**Trigger:** No open loan is due for a reminder (step 2)
**Flow:**

1. System displays that no reminder is due today.
2. Use case ends.

## Postconditions

### Success Postconditions

- Each listed member has received a reminder

### Failure Postconditions

- No reminder is sent

## Business Rules

### BR-001: Reminder Time

A reminder is due 3 days before the due date (UC-002 BR-002).
