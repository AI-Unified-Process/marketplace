# UC-021: Book Appointment

## Main Success Scenario

1. Receptionist opens the Appointments page (route `appointments`).
2. The system displays a grid of appointments with columns: Patient, Practitioner, Reason, Date.
3. Receptionist clicks the "Book Appointment" button.
4. The system opens a "Book Appointment" dialog with fields: Patient (combo box), Practitioner (combo box), Reason (text field).
5. Receptionist selects the patient and practitioner, enters a reason, and clicks "Book".
6. The system saves the appointment, closes the dialog, refreshes the grid, and shows the notification "Appointment booked".
7. When the booked appointment is the patient's first, the system sets the patient's status to "Active".

## A1: Cancel Booking

1. Same as Main Success Scenario steps 1–4.
2. Receptionist clicks "Cancel" in the dialog.
3. The dialog closes and no appointment is created.

## Business Rules

### BR-040
Patient, Practitioner, and Reason are required.

### BR-041
An appointment cannot be deleted after the patient record it belongs to — deletions must remove appointments before their patient.
