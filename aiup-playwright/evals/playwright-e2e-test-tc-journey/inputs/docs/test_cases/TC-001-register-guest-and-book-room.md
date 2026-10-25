# Test Case: Register Guest and Book Room

## Overview

**ID:** TC-001  
**Goal:** A front desk agent registers a new guest and books a Deluxe Suite for them — verifying that a guest registered at the desk can be booked right away.  
**Priority:** Critical  
**Status:** Approved

## Roles

- Front Desk Agent

## Preconditions

- Room type "Deluxe Suite" exists (Flyway test data `R__test_data.sql`)
- No guest with email "mia.keller@example.com" exists

## Flow

| Step | Name                  | Description                                                     | Test Data                                   | Use Case                                          |
|------|-----------------------|-----------------------------------------------------------------|---------------------------------------------|---------------------------------------------------|
| 1    | Register guest        | The agent registers a new guest                                 | Mia, Keller, mia.keller@example.com         | [UC-020](../use_cases/UC-020-register-guest.md)   |
| 2    | Verify guest listed   | The new guest appears on the Guests page                        | -                                           | -                                                 |
| 3    | Book room             | The agent books a Deluxe Suite for the guest                    | Mia Keller, Deluxe Suite, 2026-12-01, 2026-12-04 | [UC-030](../use_cases/UC-030-book-room.md)   |
| 4    | Verify confirmation   | The reservation confirmation is shown                           | -                                           | -                                                 |

## Validation

1. **Confirmation**: The message "Reservation confirmed." is shown after step 3.
2. **Reservation listed**: The Reservations page lists one reservation for Mia Keller, Deluxe Suite, 2026-12-01 to 2026-12-04.

## Postconditions

- One guest "Mia Keller" (mia.keller@example.com) exists.
- One reservation for that guest (Deluxe Suite, 2026-12-01 to 2026-12-04) exists.
- The reservation must be deleted before the guest it belongs to; the seeded room types and guests remain untouched.
