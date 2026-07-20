# Use Case: Register Student

## Overview

**Use Case ID:** UC-005   
**Use Case Name:** Register Student   
**Primary Actor:** Administrator   
**Goal:** The administrator registers a new student so the student can enroll in courses.   
**Status:** Approved

## Preconditions

- The administrator is signed in.
- The Students view is reachable at route `students`.

## Main Success Scenario

1. The administrator opens the Students view.
2. The system displays the students grid with a "Register Student" button.
3. The administrator clicks "Register Student".
4. The system opens a dialog with fields "Full Name", "Email", and "Matriculation Date".
5. The administrator enters the student's data and clicks "Save".
6. The system validates the input, records the student with status "Registered", closes the dialog, and shows the notification "Student registered".
7. The system displays the new student in the students grid.

## Alternative Flows

### A1: Required field missing

**Trigger:** A required field is empty when the administrator clicks "Save" (step 5)
**Flow:**

1. The system marks the empty fields with the error "must not be empty" and keeps the dialog open.
2. Use case continues at step 5.

### A2: Duplicate email

**Trigger:** The entered email already belongs to a student (step 5)
**Flow:**

1. The system shows the error "A student with this email already exists" on the Email field and keeps the dialog open.
2. Use case continues at step 5.

## Postconditions

### Success Postconditions

- The student is recorded with status "Registered" and appears in the students grid.

### Failure Postconditions

- No student is recorded; the grid is unchanged.

## Business Rules

### BR-010: Unique email

Every student's email address is unique across all students.
