# UC-030: Manage Employees

## Main Success Scenario

1. User opens the Employee Management page.
2. The system displays a grid of existing employees with columns: First Name, Last Name, Department, Email.
3. User clicks the "Add Employee" button.
4. The system opens an "Add Employee" dialog with fields: First Name, Last Name, Department (combo box), Email.
5. User fills in all fields and clicks "Save".
6. The system saves the employee, closes the dialog, refreshes the grid, and shows a success notification.

## A1: Validation Error on Empty Required Fields

1. Same as Main Success Scenario steps 1–4.
2. User clicks "Save" without filling in required fields.
3. The system marks the required fields as invalid and shows error messages.
4. The dialog remains open.

## Business Rules

### BR-001
First Name and Last Name are required.

### BR-002
Email must be a valid email address.

### BR-003
Department is required and must be selected from the available list.
