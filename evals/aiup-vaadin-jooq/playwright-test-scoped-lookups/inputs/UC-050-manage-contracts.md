# UC-050: Manage Contracts

## Overview

The **Manage Contracts** view allows operations staff to view, search, and edit contracts. Contracts are displayed in a paginated grid. Staff can open a contract for editing via the "Edit" button on each row.

## Main Success Scenario

1. User navigates to the Manage Contracts view (`/contracts`)
2. System displays a grid of contracts (may contain 100 or more records)
3. Each row in the grid has columns: Contract ID, Client Name, Start Date, Status, Notes, and an "Edit" action button
4. User clicks the "Edit" button on a contract row
5. System opens a modal dialog titled "Edit Contract" with a form containing:
   - **Contract ID** (read-only text field)
   - **Client Name** (text field)
   - **Start Date** (date picker)
   - **Status** (combo box with values: Draft, Active, Expired, Cancelled)
   - **Notes** (text area for free-form notes about the contract)
   - **Save** button (saves changes and closes dialog)
   - **Cancel** button (discards changes and closes dialog)
   - **Close** (icon-only button in dialog header)
6. User edits the desired fields and clicks Save
7. System saves the changes and shows a success notification "Contract saved"
8. Dialog closes and the grid reflects the updated contract data

## Business Rules

### BR-001: Notes field on main page
The main Manage Contracts page also has a "Notes" filter/search field at the top of the grid for filtering contracts by notes content. This means there are two "Notes" fields when the Edit dialog is open: the filter field on the main page and the Notes text area in the dialog.

### BR-002: Large dataset
The contracts grid may contain 100 or more records. The grid uses Vaadin's virtual scrolling so not all rows are rendered in the DOM at once.

### BR-003: No duplicate Contract IDs after save
Editing a contract must not change its Contract ID. The Contract ID field is read-only in the edit dialog.

### BR-004: Success notification required
After saving, a "Contract saved" notification must be shown to confirm the operation.

## Test Data

The test Flyway migration `V900__test_data_contracts.sql` populates 120 contracts for use in integration tests.
