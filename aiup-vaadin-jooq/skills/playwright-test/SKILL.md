---
name: playwright-test
description: >
  Creates Playwright browser-based integration tests for Vaadin views covering
  navigation, form interactions, grid operations, and dialog handling. Use when
  the user asks to "write Playwright tests", "create e2e tests", "write
  integration tests", "test in the browser", or mentions end-to-end testing,
  browser tests, UI integration tests, or Playwright for Vaadin.
---

# Playwright Test

## Instructions

Create Playwright integration tests for Vaadin views on the use case $ARGUMENTS. Playwright tests run in a real browser against a running
application. Tests use the Drama Finder library which provides type-safe Playwright element wrappers for Vaadin components.

## DO NOT

- Use Mockito for mocking
- Access services, repositories, or DSLContext directly
- Delete all data in cleanup (only remove data created during the test)
- Assume all grid rows are rendered (viewport limits visible rows)
- Use raw Playwright locators like `page.locator("vaadin-text-field")` — use Drama Finder element wrappers instead
- Use `Thread.sleep()` or `page.waitForTimeout()` — Drama Finder assertions auto-retry

## Test Data Strategy

Use existing test data from Flyway migrations in `src/test/resources/db/migration`.

| Approach         | Location                               | Purpose                  |
|------------------|----------------------------------------|--------------------------|
| Flyway migration | src/test/resources/db/migration/V*.sql | Existing test data       |
| Manual cleanup   | @AfterEach method                      | Remove test-created data |

## Test Class Structure

Extend `AbstractBasePlaywrightIT` directly. Annotate with `@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)`, inject `@LocalServerPort`, and override `getUrl()` and `getView()`.

## Template

Use [templates/ExampleViewIT.java](templates/ExampleViewIT.java) as the test class structure.

## Key Classes

| Class                      | Purpose                                            |
|----------------------------|----------------------------------------------------|
| AbstractBasePlaywrightIT   | Base class: browser lifecycle, page, Vaadin waits  |
| GridElement                | Grid interactions: rows, cells, selection, scroll   |
| TextFieldElement           | Text field: setValue, getValue, validation          |
| ButtonElement              | Button: click, enabled/disabled state              |
| ComboBoxElement            | ComboBox: selectItem, filterAndSelectItem           |
| DialogElement              | Dialog: open/close state, header/content/footer     |
| CheckboxElement            | Checkbox: checked/unchecked/indeterminate state     |
| DatePickerElement          | Date picker: date value, validation                 |
| NotificationElement        | Notification: message text, theme                   |
| page                       | Playwright Page object for navigation               |

## Common Patterns

### Navigate to View

Override `getView()` in the test class to set the route:

```java
@Override
public String getView() {
    return "persons";
}
```

The base class automatically navigates to this view and waits for Vaadin to be ready before each test.

### Drama Finder

Find information about the Drama Finder library:
https://parttio-dramafinder-4.mintlify.app

Drama Finder API:
https://parttio-dramafinder-4.mintlify.app/api/

### Locate Vaadin Components

Drama Finder uses ARIA roles and accessible names to find elements — not CSS selectors:

```java
// Text field by label
TextFieldElement nameField = TextFieldElement.getByLabel(page, "Name");

// Button by text
ButtonElement saveButton = ButtonElement.getByText(page, "Save");

// ComboBox by label
ComboBoxElement countryCombo = ComboBoxElement.getByLabel(page, "Country");

// Checkbox by label
CheckboxElement activeCheckbox = CheckboxElement.getByLabel(page, "Active");

// Date picker by label
DatePickerElement birthDate = DatePickerElement.getByLabel(page, "Birth Date");
```

### Scoped Lookups

Find elements within a specific container to avoid ambiguity:

```java
// Within a dialog
DialogElement dialog = DialogElement.getByHeaderText(page, "Edit Person");
TextFieldElement nameField = TextFieldElement.getByLabel(dialog.getLocator(), "Name");
ButtonElement saveButton = ButtonElement.getByText(dialog.getLocator(), "Save");
```

### Grid Operations

```java
GridElement grid = GridElement.get(page);

// Total row count (all data, not just rendered)
int total = grid.getTotalRowCount();

// Find cell by row index and column header text
var cell = grid.findCell(0, "Name");

// Select a row
grid.select(0);

// Get row and check selection
var row = grid.findRow(0);
row.get().isSelected();

// Scroll to distant row
grid.scrollToRow(50);

// Sort by clicking header
var header = grid.findHeaderCellByText("Name");
header.get().clickSort();

// Wait for grid to finish loading
grid.waitForGridToStopLoading();
```

### Form Interactions

```java
// Set value
TextFieldElement nameField = TextFieldElement.getByLabel(page, "Name");
nameField.setValue("John Doe");

// Read value
String value = nameField.getValue();

// Clear and set new value
nameField.clear();
nameField.setValue("Jane Doe");

// Click button
ButtonElement saveButton = ButtonElement.getByText(page, "Save");
saveButton.click();
```

### ComboBox Interactions

```java
ComboBoxElement countryCombo = ComboBoxElement.getByLabel(page, "Country");

// Select item
countryCombo.selectItem("Finland");

// Filter and select (for lazy-loading combo boxes)
countryCombo.filterAndSelectItem("Fin");
```

### Dialog Interactions

```java
// Find dialog by header text
DialogElement dialog = DialogElement.getByHeaderText(page, "Confirm Delete");

// Assert dialog is open
dialog.assertOpen();

// Interact with elements inside the dialog
ButtonElement confirmButton = ButtonElement.getByText(dialog.getLocator(), "Confirm");
confirmButton.click();

// Assert dialog closed
dialog.assertClosed();
```

## Assertions Reference

Drama Finder assertions auto-retry until the condition is met or timeout (no manual waits needed):

| Assertion Type     | Example                                               |
|--------------------|-------------------------------------------------------|
| Value              | `nameField.assertValue("John Doe")`                  |
| Visibility         | `saveButton.assertVisible()`                          |
| Enabled/Disabled   | `saveButton.assertEnabled()`                          |
| Valid/Invalid      | `nameField.assertValid()`                             |
| Error message      | `nameField.assertErrorMessage("Required")`            |
| Checked            | `checkbox.assertChecked()`                            |
| Dialog open/closed | `dialog.assertOpen()`                                 |
| Grid row count     | `assertThat(grid.getTotalRowCount()).isGreaterThan(0)` |
| Grid cell text     | `assertThat(cell.get().getCellContentLocator()).hasText("x")` |

## Viewport Considerations

Playwright tests run in a real browser with viewport constraints:

- Not all grid rows may be rendered (virtualization)
- Use `getTotalRowCount()` for the actual count, `getRenderedRowCount()` for visible rows
- Use `grid.scrollToRow(index)` to bring off-screen rows into view
- Use `isGreaterThan()` instead of exact counts when appropriate

## Workflow

1. Read the use case specification
2. Use TodoWrite to create a task for each test scenario
3. Create test class extending `AbstractBasePlaywrightIT` with `@SpringBootTest` and `@LocalServerPort`
4. For each test:
    - Override `getView()` for navigation (base class handles page load and Vaadin readiness)
    - Use Drama Finder element wrappers to locate components by label/text
    - Perform interactions (setValue, click, selectItem)
    - Assert expected outcomes using auto-retry assertions
    - Clean up test data if created during test
5. Run tests to verify they pass
6. If a test fails:
    - Verify the view loaded correctly
    - Check that test data exists in the Flyway test migrations
    - For grid assertions, use `isGreaterThan()` instead of exact counts
    - Use `grid.waitForGridToStopLoading()` for grids with async data
7. Mark todos complete
