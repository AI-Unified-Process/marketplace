# Use Case: Enroll in Course

## Overview

**Use Case ID:** UC-006   
**Use Case Name:** Enroll in Course   
**Primary Actor:** Administrator   
**Goal:** The administrator enrolls a registered student in a course so the student can attend it.   
**Status:** Approved

## Preconditions

- The administrator is signed in.
- The student to enroll is registered.
- The Enrollments view is reachable at route `enrollments`.
- At least one course with free capacity exists.

## Main Success Scenario

1. The administrator opens the Enrollments view.
2. The system displays the enrollments grid with an "Enroll Student" button.
3. The administrator clicks "Enroll Student".
4. The system opens a dialog with the combo boxes "Student" and "Course".
5. The administrator selects the student and the course and clicks "Enroll".
6. The system validates the selection, records the enrollment, closes the dialog, and shows the notification "Enrollment saved".
7. The system displays the new enrollment in the enrollments grid; the first enrollment sets the student's status to "Active".

## Alternative Flows

### A1: Course is full

**Trigger:** The selected course has no free capacity (step 5)
**Flow:**

1. The system shows the error "Course is full" and keeps the dialog open.
2. Use case continues at step 5.

### A2: Student already enrolled

**Trigger:** The student is already enrolled in the selected course (step 5)
**Flow:**

1. The system shows the error "Student is already enrolled in this course" and keeps the dialog open.
2. Use case continues at step 5.

## Postconditions

### Success Postconditions

- The enrollment is recorded and appears in the enrollments grid.
- The student's status is "Active" after their first enrollment.

### Failure Postconditions

- No enrollment is recorded; the student's status is unchanged.

## Business Rules

### BR-011: Capacity limit

A course never has more enrollments than its capacity.

### BR-012: First enrollment activates

A student's status changes from "Registered" to "Active" with their first enrollment.
