# Student Onboarding Test Case

## Problem/Feature Description

A university's enrollment system follows the AI Unified Process. Two use cases are specified and approved:
UC-005 "Register Student" (`docs/use_cases/UC-005-register-student.md`) and UC-006 "Enroll in Course"
(`docs/use_cases/UC-006-enroll-in-course.md`). Registering a student and enrolling them in their first course is the
system's most important user journey — the first enrollment is what activates the student.

The QA team wants this journey documented as an end-to-end test case that chains the two use cases, so it can later be
automated as a browser test. The test case document is the authority the automation will follow: it must define the
journey's steps in order, the exact data values each step enters, and the checks that verify the journey's end state.
The seeded course "Databases 101" (with free capacity) is provided by the Flyway test migration
`V900__test_data_courses.sql`.

Create the test case document chaining UC-005 and UC-006. There are no test cases in the project yet.

## Output Specification

Produce a single Markdown document under `docs/test_cases/`. It must describe one end-to-end journey: an administrator
registers a new student and enrolls them in the seeded course, and the journey's validations confirm the enrollment
exists and the student ends up "Active". The document must be precise enough that a test automation engineer (or an
agent) could implement a browser test from it without consulting anything else except the two linked use case
specifications.
