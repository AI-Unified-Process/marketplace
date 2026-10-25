# Test Case: First Registration for a New Workshop

## Overview

**ID:** TC-001  
**Goal:** An organizer creates a workshop, a participant registers for it, and the organizer sees the participant in the list with one place less free  
**Priority:** High  
**Status:** Approved

## Roles

- Organizer (creates the workshop and checks the participant list)
- Participant (registers for the workshop)

## Preconditions

- The user `organizer` with the role ORGANIZER exists (Flyway test data `V900__test_data.sql`)
- No workshop titled "Clean Architecture Basics" exists

## Flow

| Step | Name                    | Description                                                                 | Test Data                                                               | Use Case                                              |
|------|-------------------------|-----------------------------------------------------------------------------|-------------------------------------------------------------------------|-------------------------------------------------------|
| 1    | Create workshop         | The organizer creates a workshop and saves it                               | Title: Clean Architecture Basics; Start: 2027-03-15 09:00; Capacity: 2  | [UC-001](../use_cases/UC-001-manage-workshops.md)     |
| 2    | Verify workshop listed  | The workshop appears in the workshop list with its start time               | -                                                                       | -                                                     |
| 3    | Register participant    | The participant selects the workshop, enters name and email, and confirms  | Name: Ada Keller; Email: ada.keller@example.com                         | [UC-002](../use_cases/UC-002-register-for-workshop.md) |
| 4    | Verify confirmation     | The message "You are registered for Clean Architecture Basics." is shown    | -                                                                       | -                                                     |
| 5    | List participants       | The organizer opens the participants of the workshop                        | -                                                                       | [UC-003](../use_cases/UC-003-list-participants.md)    |
| 6    | Verify participant      | Ada Keller is listed with the email ada.keller@example.com                  | -                                                                       | -                                                     |

## Validation

1. **Free places**: The workshop shows 1 free place after the registration.
2. **Registration count**: The participant list shows 1 registration.

## Postconditions

- The workshop "Clean Architecture Basics" exists with one registration
- The registration must be deleted before the workshop it belongs to
