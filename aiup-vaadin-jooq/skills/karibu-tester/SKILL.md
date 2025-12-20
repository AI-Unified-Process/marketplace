---
name: karibu-tester
description: Creates Karibu unit tests for Vaadin views.
---

# Karibu Test Writer

## Instructions

Create Karibu unit tests for Vaadin views. Karibu Testing allows server-side testing of Vaadin components without a
browser.

Use the KaribuTesting MCP server for documentation and code generation.

## DO NOT

- Use Mockito for mocking
- Use @Transactional annotation (transaction boundaries must stay intact)
- Use services, repositories, or DSLContext to create test data
- Delete all data in cleanup (only remove data created during the test)
- Use browser-based testing patterns (this is server-side testing)

## Test Data Strategy

Create test data using Flyway migrations in `src/test/resources/db/migration`.

| Approach         | Location                               | Purpose                  |
|------------------|----------------------------------------|--------------------------|
| Flyway migration | src/test/resources/db/migration/V*.sql | Populate test data       |
| Manual cleanup   | @AfterEach method                      | Remove test-created data |

## Key Helper Classes

| Class                                                   | Purpose                          |
|---------------------------------------------------------|----------------------------------|
| com.github.mvysny.kaributesting.v10.LocatorJ            | Find components                  |
| com.github.mvysny.kaributesting.v10.GridKt              | Grid assertions and interactions |
| com.github.mvysny.kaributesting.v10.NotificationsKt     | Notification assertions          |
| com.github.mvysny.kaributesting.v10.pro.ConfirmDialogKt | ConfirmDialog interactions       |

## Template

Use [templates/ExampleViewTest.java](templates/ExampleViewTest.java) as the test class structure.

## Common Patterns

### Navigate to View

```java
UI.getCurrent().

navigate(PersonView .class);
```

### Find Components

```java
// Find by type
var grid = _get(Grid.class);
var button = _get(Button.class, spec -> spec.withCaption("Save"));
var textField = _get(TextField.class, spec -> spec.withLabel("Name"));

// Find all matching
List<Button> buttons = _find(Button.class);
```

### Grid Operations

```java
// Get grid size
assertThat(GridKt._size(grid)).

isEqualTo(100);

// Get selected items
Set<PersonRecord> selected = grid.getSelectedItems();

// Select a row
GridKt.

_selectRow(grid, 0);

// Get cell component (for action buttons)
GridKt.

_getCellComponent(grid, 0,"actions")
    .

getChildren()
    .

filter(Button .class::isInstance)
    .

findFirst()
    .

map(Button .class::cast)
    .

ifPresent(Button::click);

// Get cell value
String name = GridKt._getFormattedRow(grid, 0).get("name");
```

### Form Interactions

```java
// Set field values
_get(TextField .class, spec ->spec.

withLabel("Name")).

_setValue("John");

_get(ComboBox .class, spec ->spec.

withLabel("Country")).

_setValue(country);

_get(DatePicker .class, spec ->spec.

withLabel("Birth Date")).

_setValue(LocalDate.of(1990, 1,1));

// Click button
_get(Button .class, spec ->spec.

withCaption("Save")).

_click();
```

### Notification Assertions

```java
// Expect notification
expectNotifications("Record saved successfully");

// Assert no notifications
assertThat(NotificationsKt.getNotifications()).

isEmpty();
```

### ConfirmDialog

```java
// Click confirm in dialog
ConfirmDialogKt._fireConfirm(_get(ConfirmDialog.class));

// Click cancel
        ConfirmDialogKt.

_fireCancel(_get(ConfirmDialog.class));
```

## Assertions Reference

Use AssertJ or Karibu Testing assertions:

| Assertion Type    | Example                                           |
|-------------------|---------------------------------------------------|
| Grid size         | `assertThat(GridKt._size(grid)).isEqualTo(10)`    |
| Component visible | `assertThat(button.isVisible()).isTrue()`         |
| Component enabled | `assertThat(button.isEnabled()).isTrue()`         |
| Field value       | `assertThat(textField.getValue()).isEqualTo("x")` |
| Collection size   | `assertThat(items).hasSize(5)`                    |
| Notifications     | `expectNotifications("Success")`                  |

## Workflow

1. Read the use case specification
2. Use TodoWrite to create a task for each test scenario
3. Create test class using the template
4. For each test:
    - Navigate to the view
    - Find components using LocatorJ
    - Perform interactions
    - Assert expected outcomes
    - Clean up test data if created during test
5. Run tests to verify
6. Mark todos complete

## Resources

- Karibu Testing documentation: https://github.com/mvysny/karibu-testing/tree/master/karibu-testing-v10
- Use the KaribuTesting MCP server for additional patterns
