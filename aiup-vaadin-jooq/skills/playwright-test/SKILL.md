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
application.

## DO NOT

- Use Mockito for mocking
- Access services, repositories, or DSLContext directly
- Delete all data in cleanup (only remove data created during the test)
- Forget to wait for Vaadin connections to settle after interactions
- Assume all grid rows are rendered (viewport limits visible rows)

## Test Data Strategy

Use existing test data from Flyway migrations in `src/test/resources/db/migration`.

| Approach         | Location                               | Purpose                  |
|------------------|----------------------------------------|--------------------------|
| Flyway migration | src/test/resources/db/migration/V*.sql | Existing test data       |
| Manual cleanup   | @AfterEach method                      | Remove test-created data |

## Test Class Structure

Extend from `PlaywrightIT` base class.

## Template

Use [templates/ExampleViewIT.java](templates/ExampleViewIT.java) as the test class structure.

## Key Classes

| Class  | Purpose                               |
|--------|---------------------------------------|
| GridPw | Grid interactions and assertions      |
| page   | Playwright Page object for navigation |
| mopo   | Vaadin connection helper              |

## Common Patterns

### Navigate to View

```java
page.navigate("http://localhost:%d/persons".formatted(localServerPort));
```

### Wait for Vaadin Connection

Always wait after interactions that trigger server communication:

```java
mopo.waitForConnectionToSettle();
```

### Grid Operations

```java
GridPw gridPw = new GridPw(page);

// Get rendered row count (viewport limited!)
int count = gridPw.getRenderedRowCount();

// Get specific row
GridPw.RowPw row = gridPw.getRow(0);

// Get cell text
String text = row.getCell(0).innerText();

// Select row
row.select();
mopo.waitForConnectionToSettle();
```

### Locate Vaadin Components

```java
// Text field by label
Locator nameField = page.locator("vaadin-text-field")
                .filter(new Locator.FilterOptions().setHasText("Name"))
                .locator("input");

// Button by text
Locator saveButton = page.locator("vaadin-button")
        .filter(new Locator.FilterOptions().setHasText("Save"));

// ComboBox
Locator comboBox = page.locator("vaadin-combo-box")
        .filter(new Locator.FilterOptions().setHasText("Country"));
```

### Form Interactions

```java
// Get input value
String value = nameField.inputValue();

// Fill text field
nameField.fill("New Value");

// Click button
saveButton.click();
mopo.waitForConnectionToSettle();

// Clear and fill
nameField.clear();
nameField.fill("Updated Value");
```

### ComboBox Interactions

```java
// Open and select
comboBox.click();
page.locator("vaadin-combo-box-item")
    .filter(new Locator.FilterOptions().setHasText("Option 1"))
    .click();
mopo.waitForConnectionToSettle();
```

### Dialog Interactions

```java
// Confirm dialog
page.locator("vaadin-confirm-dialog")
    .locator("vaadin-button")
    .filter(new Locator.FilterOptions().setHasText("Confirm"))
    .click();
mopo.waitForConnectionToSettle();
```

## Assertions Reference

Use AssertJ assertions:

| Assertion Type | Example                                                     |
|----------------|-------------------------------------------------------------|
| Text content   | `assertThat(row.getCell(0).innerText()).isEqualTo("x")`     |
| Input value    | `assertThat(field.inputValue()).isEqualTo("value")`         |
| Row count      | `assertThat(gridPw.getRenderedRowCount()).isGreaterThan(0)` |
| Visibility     | `assertThat(element.isVisible()).isTrue()`                  |
| Enabled        | `assertThat(element.isEnabled()).isTrue()`                  |

## Viewport Considerations

Playwright tests run in a real browser with viewport constraints:

- Not all grid rows may be rendered
- Use `isGreaterThan()` instead of exact counts for grids
- Scroll if needed to access off-screen elements

## Workflow

1. Read the use case specification
2. Use TodoWrite to create a task for each test scenario
3. Create test class extending PlaywrightIT
4. For each test:
    - Navigate to the view
    - Wait for connection to settle
    - Locate components using Vaadin selectors
    - Perform interactions (always wait after)
    - Assert expected outcomes
    - Clean up test data if created during test
5. Run tests to verify they pass
6. If a test fails:
    - Verify the view loaded correctly (check page URL and title)
    - Ensure `mopo.waitForConnectionToSettle()` is called after every interaction
    - Check that test data exists in the Flyway test migrations
    - For grid assertions, use `isGreaterThan()` instead of exact counts
7. Mark todos complete
