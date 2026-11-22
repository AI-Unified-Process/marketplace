# Test Case: Guest Registration with Duplicate Email

## Overview

**ID:** TC-003  
**Goal:** A front desk agent registers a new guest, is stopped from registering a second guest with the same email, and then finds the one registered guest by last name.  
**Priority:** High  
**Status:** Approved

## Roles

- Front Desk Agent (registers and finds guests)

## Preconditions

- The front desk agent is logged in
- The guests Anna Berger, Luca Rossi, and Mia Weber exist, and no guest has the last name Doe or the email jane.doe@example.com (Flyway test data `V900__guest_test_data.sql`)

## Flow

| Step | Name                      | Description                                                                              | Test Data                                     | Use Case                                          |
|------|---------------------------|------------------------------------------------------------------------------------------|-----------------------------------------------|---------------------------------------------------|
| 1    | Register guest            | The agent opens the Guests view and registers a new guest                                | Jane, Doe, jane.doe@example.com, 1992-05-17   | [UC-020](../use_cases/UC-020-register-guest.md)   |
| 2    | Verify guest registered   | The message "Guest registered" is shown and Jane Doe appears in the list                 | -                                             | -                                                 |
| 3    | Register duplicate email  | The agent registers a second guest with the email of the guest from step 1               | John, Doe, jane.doe@example.com, 1988-01-09   | [UC-020](../use_cases/UC-020-register-guest.md)   |
| 4    | Verify duplicate rejected | The message "Email already registered" is shown and the entered values stay in the form  | -                                             | -                                                 |
| 5    | Find guest                | The agent searches the guests by the last name of the guest from step 1                  | Doe                                           | [UC-021](../use_cases/UC-021-find-guest.md)       |
| 6    | Verify one guest found    | The list shows exactly one guest: Jane Doe with jane.doe@example.com                     | -                                             | -                                                 |

## Validation

1. **No duplicate guest**: Searching for the last name Doe lists exactly one guest, Jane Doe, with the email jane.doe@example.com; John Doe is not listed.
2. **Seeded guests unchanged**: Searching for the last name Berger still lists Anna Berger with anna.berger@example.com.

## Postconditions

- One guest Jane Doe (jane.doe@example.com, born 1992-05-17) exists.
- The seeded guests Anna Berger, Luca Rossi, and Mia Weber remain untouched.
