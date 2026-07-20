# Test Scenario: Patient Intake

## Overview

**ID:** TS-002   
**Goal:** A receptionist registers a new patient and books their first appointment — verifying the intake journey from registration to a confirmed appointment end-to-end.   
**Status:** Approved

## Roles

- Receptionist

## Preconditions

- Practitioner "Dr. Smith" exists (Flyway test data `V901__test_data_practitioners.sql`)

## Flow

| Step | Name                    | Description                                                                | Test Data                                | Use Case                                             |
|------|-------------------------|----------------------------------------------------------------------------|------------------------------------------|------------------------------------------------------|
| 1    | Register patient        | The receptionist registers a new patient                                   | Erika Muster, erika.muster@example.com, 12/04/1985 | [UC-020](../use_cases/UC-020-register-patient.md)    |
| 2    | Verify patient listed   | The new patient appears in the patients grid with status "Registered"      | -                                        | -                                                    |
| 3    | Book appointment        | The receptionist books the patient's first appointment with a practitioner | Erika Muster, Dr. Smith, Checkup         | [UC-021](../use_cases/UC-021-book-appointment.md)    |
| 4    | Verify confirmation     | An appointment confirmation notification is shown                          | -                                        | -                                                    |

## Validation

1. **Appointment listed**: The appointments grid contains an appointment for the patient with the practitioner from step 3.
2. **Patient activated**: Back on the patients grid, the patient's status is "Active" after the first appointment is booked.
