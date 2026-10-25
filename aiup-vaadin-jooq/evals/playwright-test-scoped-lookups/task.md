# Write Playwright Integration Tests for Manage Contracts View

## Problem Description

The operations team has built a "Manage Contracts" Vaadin view (UC-050) that is now ready for integration testing. The view shows a contracts grid that can contain over 100 records with virtual scrolling, and each row has an "Edit" button that opens a modal dialog. The dialog contains a form for editing contract details including a "Notes" text area.

A complication has been discovered: the main contracts page has a "Notes" filter field at the top (for searching contracts by notes content), and the "Edit Contract" dialog also has a "Notes" field. These two fields share the same label name, which must be handled carefully in the tests to ensure the correct field is targeted.

The dialog also has a close button in its header that is icon-only (no visible text), relying on its accessible ARIA label for identification.

Your task is to write Playwright integration tests for UC-050 using the Drama Finder library (the API reference is provided in `references/dramafinder-api.md`). The tests should cover:

1. Verifying the contracts grid contains the expected number of records (the test dataset has 120 contracts pre-loaded by Flyway migration `V900__test_data_contracts.sql`)
2. Opening the Edit Contract dialog by clicking the "Edit" button on a row
3. Editing the "Notes" field inside the dialog and saving
4. Verifying the success notification appears after saving
5. Verifying the total contract count in the grid has not changed after an edit
6. Verifying the dialog can be dismissed using the close button

The test class must follow the project naming convention for use case tests. Group related test scenarios logically, and ensure the tests are reliable — the application handles its own synchronization.

## Output Specification

Produce a single Java test file at:

```
src/test/java/com/example/contracts/UC050ManageContractsIT.java
```

The file should contain the complete, runnable Playwright integration test class. The test must be executable with `./mvnw verify -Pit`.

Do NOT include the `references/` directory contents in your output — those are provided as supporting documentation only.
