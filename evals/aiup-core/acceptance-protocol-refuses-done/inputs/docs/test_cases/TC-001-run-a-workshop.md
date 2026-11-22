# Test Case: Run a Workshop

## Overview

**ID:** TC-001  
**Goal:** An organizer creates a workshop, a participant registers for it, and the organizer sees the participant in the list  
**Priority:** Critical  
**Status:** Automated

## Roles

- Organizer (creates the workshop and checks the participants)
- Participant (registers)

## Preconditions

- The organizer account `organizer@example.com` with the role ORGANIZER exists

## Flow

| Step | Name                 | Description                                                         | Test Data                                      | Use Case                                              |
|------|----------------------|---------------------------------------------------------------------|------------------------------------------------|-------------------------------------------------------|
| 1    | Create workshop      | The organizer creates a workshop                                    | "Kanban Basics", 2026-12-01 09:00, capacity 2 | [UC-001](../use_cases/UC-001-manage-workshops.md)     |
| 2    | Verify workshop      | "Kanban Basics" is in the workshop list                             | -                                              | -                                                     |
| 3    | Register             | A participant registers for "Kanban Basics"                         | Ana Silva, ana@example.com                     | [UC-002](../use_cases/UC-002-register-for-workshop.md) |
| 4    | Verify registration  | The message "You are registered for Kanban Basics." appears         | -                                              | -                                                     |
| 5    | List participants    | The organizer opens the participants of "Kanban Basics"             | -                                              | [UC-003](../use_cases/UC-003-list-participants.md)    |
| 6    | Verify participants  | Ana Silva is listed; 1 registration, 1 free place                   | -                                              | -                                                     |

## Validation

1. **Free places**: "Kanban Basics" shows 1 free place in the workshop list

## Postconditions

- The workshop "Kanban Basics" and Ana Silva's registration exist
