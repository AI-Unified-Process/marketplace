# UC-020: Register Patient

## Main Success Scenario

1. Receptionist opens the Patients page (route `patients`).
2. The system displays a "Name" filter field above a grid of patients with columns: Name, Email, Birth Date, Status.
3. Receptionist clicks the "Register Patient" button.
4. The system opens a "Register Patient" dialog with fields: Name (text field), Email (email field), Birth Date (date picker).
5. Receptionist fills in all fields and clicks "Register".
6. The system saves the patient with status "Registered", closes the dialog, refreshes the grid, and shows the notification "Patient registered".

## A1: Validation Error on Missing Name

1. Same as Main Success Scenario steps 1–4.
2. Receptionist clicks "Register" without entering a name.
3. The system marks the Name field as invalid and the dialog remains open.

## Business Rules

### BR-030
Name and Email are required; Email must be a valid email address.

### BR-031
The "Name" filter field on the page and the "Name" field in the dialog share the same label — tests must scope lookups accordingly.

### BR-032
A newly registered patient always has status "Registered".
