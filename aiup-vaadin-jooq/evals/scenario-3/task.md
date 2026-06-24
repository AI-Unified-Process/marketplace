# Employee Management Integration Tests

## Problem/Feature Description

The HR team has finished building an Employee Management view in their Vaadin web application. The view shows a grid of employees and lets managers add new employees through a dialog form. When adding a new employee, the form collects First Name, Last Name, Department (a combo box), and Email. On successful save, the grid refreshes and a confirmation notification appears. If required fields are left blank, validation errors appear and the dialog stays open.

Your task is to write Playwright integration tests for this view that cover the main user journeys. The use case spec is in `docs/use-cases/UC-030-manage-employees.md`. An API reference for the element library you must use is in `references/dramafinder-api.md`, and an example test file showing patterns and import style is in `references/ExampleViewIT.java`.

The view is served at the path `/employees` on a locally running Spring Boot server (the base URL will be injected at test runtime). You do not have a running application — write the test code only.

## Output Specification

Produce a single Java test file:

```
src/test/java/com/example/app/views/EmployeeManagementViewIT.java
```

The file must contain Playwright integration tests that cover:

1. The employee grid loads and displays data on page load.
2. Clicking "Add Employee" opens a dialog.
3. Filling in all form fields and clicking "Save" closes the dialog and shows a success notification.
4. Submitting the form with required fields left blank shows validation errors on those fields.

Do not include a `pom.xml` or any build file — the test class only.
