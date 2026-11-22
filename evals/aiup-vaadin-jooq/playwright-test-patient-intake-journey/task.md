# End-to-End Test for the Patient Intake User Journey (TC-002)

## Problem/Feature Description

The clinic's Vaadin application has a documented end-to-end test case for its most important user journey: **TC-002 Patient Intake**, in `docs/test_cases/TC-002-patient-intake.md`. A receptionist registers a new patient on the Patients view (UC-020) and books the patient's first appointment on the Appointments view (UC-021); booking the first appointment activates the patient.

Automate this test case in the browser with Playwright. The test case document is the authority: follow its Flow table step by step with the exact values from the Test Data column, and assert its Validation section at the end. The linked use case specifications in `docs/use_cases/` define each view's routes, labels, buttons, and notifications.

Two complications are documented in the use case specs:

1. The Patients view has a "Name" **filter field** above the grid, and the "Register Patient" dialog also has a "Name" field — the two share the same label, so lookups must target the right one.
2. An appointment must be deleted **before** the patient it belongs to (BR-041) — this constrains the cleanup order.

Use the Drama Finder element library — the API reference is provided in `references/dramafinder-api.md`. The practitioner from the preconditions is pre-loaded by Flyway test migration `V901__test_data_practitioners.sql`. You do not have a running application — write the test code only.

## Output Specification

Produce a single Java test file:

```
src/test/java/com/example/clinic/e2e/TC002PatientIntakeIT.java
```

The file must contain one complete, runnable Playwright test class that walks the whole TC-002 journey — all four Flow steps in order across both views, followed by the two Validation checks — and cleans up the data the journey created in the correct order. The test must be executable with `./mvnw verify -Pit`.

Do NOT include a `pom.xml` or any build file — the test class only.
