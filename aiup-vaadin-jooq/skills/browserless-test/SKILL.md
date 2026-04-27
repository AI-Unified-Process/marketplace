---
name: browserless-test
description: >
  Creates Vaadin Browserless server-side unit tests for Vaadin views covering
  navigation, component interactions, form validation, grid operations, and
  notifications. Use when the user asks to "write Browserless tests", "write
  Vaadin UI unit tests", "unit test a Vaadin view without a browser", "create
  view tests with the official Vaadin testing framework", or mentions
  Browserless testing, SpringBrowserlessTest, browserless-test-junit6, UI Unit
  Testing, or server-side Vaadin testing.
---

# Browserless Test

## Instructions

Create Vaadin Browserless unit tests for Vaadin views based on the use case $ARGUMENTS. Browserless Testing executes the UI directly inside the JVM — no browser, no WebDriver, no servlet container.

Browserless Testing is the **official, recommended** server-side testing framework for Vaadin. It has been free and open source under Apache 2.0 since **Vaadin 25.1** (previously the commercial UI Unit Testing add-on). It supersedes the community Karibu Testing library — prefer this skill over `/karibu-test` for any new test code.

Use the Vaadin MCP server for documentation lookups.

## Maven Dependency

```xml
<dependency>
    <groupId>com.vaadin</groupId>
    <artifactId>browserless-test-junit6</artifactId>
    <scope>test</scope>
</dependency>
```

## DO NOT

- Use Mockito for mocking
- Use `@Transactional` annotation (transaction boundaries must stay intact)
- Use services, repositories, or DSLContext to create test data
- Delete all data in cleanup (only remove data created during the test)
- Use browser-based testing patterns (this is server-side testing)
- Use Karibu's `LocatorJ`, `_get`, `_find`, `_click`, `GridKt`, `NotificationsKt` — those are the legacy Karibu API. Use the Browserless `$()` query and `test()` wrapper instead
- Read component state through `test(...)` — use the component's Java API directly (e.g. `textField.getValue()`, `button.isEnabled()`)
- Use `$()` for overlay components (Context Menu, Menu Bar) — use the dedicated tester's `clickItem()` / `find()` methods

## Test Data Strategy

Create test data using Flyway migrations in `src/test/resources/db/migration`.

| Approach         | Location                               | Purpose                  |
|------------------|----------------------------------------|--------------------------|
| Flyway migration | src/test/resources/db/migration/V*.sql | Populate test data       |
| Manual cleanup   | @AfterEach method                      | Remove test-created data |

## Base Test Class

Extend `com.vaadin.testbench.unit.SpringBrowserlessTest` and annotate the class with `@SpringBootTest`. The base class creates the Vaadin session, UI, and component tree inside the JUnit JVM.

```java
@SpringBootTest
class PersonViewTest extends SpringBrowserlessTest {
    // ...
}
```

For non-Spring projects, extend `com.vaadin.testbench.unit.BrowserlessTest` instead.

## Template

Use [templates/ExampleViewTest.java](templates/ExampleViewTest.java) as the test class structure.

## Common Patterns

### Navigate to View

```java
navigate(PersonView.class);                                  // by class
navigate("person", PersonView.class);                        // by route
navigate(PersonDetailView.class, "42");                      // with URL parameter
navigate(PersonTemplateView.class, Map.of("id", "42"));      // with URL template
HasElement currentView = getCurrentView();
```

### Find Components — `$()` Query

```java
// Single result
TextField name = $(TextField.class).single();
Button save = $(Button.class).withText("Save").single();
TextField nameField = $(TextField.class).withCaption("Name").single();
ComboBox<Country> country = $(ComboBox.class).withId("country").single();

// Scope to current view
TextField name = $view(TextField.class).single();

// Scope to a parent component
TextField name = $(TextField.class, view.formLayout).single();

// All matching
List<Button> buttons = $(Button.class).all();

// Existence check (no exception)
if ($(Notification.class).exists()) { /* ... */ }
```

#### Filters

| Filter                                | Purpose                              |
|---------------------------------------|--------------------------------------|
| `withText(String)`                    | Exact text match                     |
| `withTextContaining(String)`          | Substring text match                 |
| `withCaption(String)`                 | Exact caption (label) match          |
| `withCaptionContaining(String)`       | Substring caption match              |
| `withId(String)`                      | Component ID                         |
| `withClassName(String...)`            | Has all given CSS class names        |
| `withAttribute(String[, String])`     | Has attribute (optionally with value) |
| `withValue(V)`                        | For `HasValue` components            |
| `withPropertyValue(getter, value)`    | Custom getter match                  |
| `withCondition(Predicate)`            | Custom predicate                     |

#### Terminal Operators

| Operator           | Purpose                              |
|--------------------|--------------------------------------|
| `single()`         | Expect exactly one match             |
| `last()`           | Last match                           |
| `atIndex(int)`     | Match at position                    |
| `all()`            | Return `List`                        |
| `id(String)`       | Match by ID                          |
| `exists()`         | Boolean check, no exception          |
| `withResultsSize(int)` / `withResultsSize(min, max)` | Assert count |

### Component Testers — `test(...)` Wrapper

Use `test(component)` for **actions** (click, setValue, selectItem). Read state from the component's Java API.

```java
// Form interactions
test($(TextField.class).withCaption("Name").single()).setValue("John");
test($(ComboBox.class).withCaption("Country").single()).selectItem("Switzerland");
test($(DatePicker.class).withCaption("Birth Date").single())
    .setValue(LocalDate.of(1990, 1, 1));
test($(Checkbox.class).withCaption("Active").single()).click();

// Buttons
test($(Button.class).withText("Save").single()).click();

// Reading state — use the component API, not the tester
String value = $(TextField.class).withCaption("Name").single().getValue();
```

#### Built-in Testers

| Component       | Key Tester Methods                                              |
|-----------------|-----------------------------------------------------------------|
| TextField       | `setValue(String)`, `clear()`                                   |
| NumberField     | `setValue(double)`                                              |
| Checkbox        | `click()` (toggles)                                             |
| Button          | `click()`, `rightClick()`, `middleClick()`                      |
| Select          | `selectItem(String)`, `selectItem(int)`                         |
| ComboBox        | `selectItem(String)`, `getSuggestionItems()`                    |
| DatePicker      | `setValue(LocalDate)`                                           |
| Grid            | `getRow(int)`, `size()`, `getCellText(row, column)`             |
| Notification    | `getText()`                                                     |
| Dialog          | `open()`, `close()`                                             |
| ConfirmDialog   | `open()`, `confirm()`, `cancel()`, `reject()`                   |
| Upload          | `upload(File)`, `uploadAll(File...)`                            |
| ContextMenu     | `clickItem(String...)`, `clickItem(int...)`, `isItemChecked()`  |
| MenuBar         | `clickItem(String...)`                                          |

### Grid Operations

```java
Grid<PersonRecord> grid = $(Grid.class).single();

// Size
assertThat(test(grid).size()).isEqualTo(100);

// Selected items (via Java API)
Set<PersonRecord> selected = grid.getSelectedItems();

// Cell value as text
String name = test(grid).getCellText(0, 1);

// Underlying row data
PersonRecord row = test(grid).getRow(0);

// Component column action — get the renderer's component and click it
test(grid).getRow(0); // ensure row is materialized
$(Button.class, grid).withCondition(b -> /* ... */).first().click();
```

### Notification Assertions

```java
// Notification is open?
assertThat($(Notification.class).exists()).isTrue();

// Read its text
String message = test($(Notification.class).single()).getText();
assertThat(message).isEqualTo("Record saved successfully");

// No notification
assertThat($(Notification.class).exists()).isFalse();
```

### ConfirmDialog

```java
ConfirmDialog dialog = $(ConfirmDialog.class).single();
test(dialog).confirm();   // click confirm
test(dialog).cancel();    // click cancel
test(dialog).reject();    // click reject (3-button dialogs)
```

### Keyboard Shortcuts

```java
fireShortcut(Key.ENTER);
fireShortcut(Key.KEY_S, KeyModifier.CONTROL);
```

### Test IDs

For components without a stable label/text, set a test ID on the server side and look up by ID:

```java
// Server-side
submitButton.setTestId("submit-button");

// In the test
Button submit = $(Button.class).id("submit-button");
```

## Assertions Reference

Use AssertJ for assertions; read state from component APIs, not from `test(...)`.

| Assertion Type    | Example                                                     |
|-------------------|-------------------------------------------------------------|
| Grid size         | `assertThat(test(grid).size()).isEqualTo(10)`               |
| Component visible | `assertThat(button.isVisible()).isTrue()`                   |
| Component enabled | `assertThat(button.isEnabled()).isTrue()`                   |
| Field value       | `assertThat(textField.getValue()).isEqualTo("x")`           |
| Field invalid     | `assertThat(textField.isInvalid()).isTrue()`                |
| Collection size   | `assertThat(items).hasSize(5)`                              |
| Notification text | `assertThat(test(notif).getText()).isEqualTo("Saved")`      |
| Component open    | `assertThat($(Dialog.class).exists()).isTrue()`             |

## Workflow

1. Read the use case specification
2. Use TodoWrite to create a task for each test scenario
3. Create the test class using the template (extend `SpringBrowserlessTest`, annotate `@SpringBootTest`)
4. For each test:
    - Navigate to the view with `navigate(...)`
    - Find components with `$()` / `$view()`
    - Perform interactions through `test(component)`
    - Assert outcomes against the component's Java API
    - Clean up test data if created during the test
5. Run tests to verify they pass
6. If a test fails:
    - Use `$()...exists()` to verify the component is in the tree
    - Use `getCurrentView()` to confirm navigation succeeded
    - Verify test data exists in the Flyway test migrations
    - For overlay components, use the dedicated tester (`ContextMenuTester`, `MenuBarTester`) — `$()` won't see them
7. Mark todos complete

## Resources

- Vaadin Browserless documentation: https://vaadin.com/docs/latest/flow/testing/browserless
- Getting started: https://vaadin.com/docs/latest/flow/testing/browserless/getting-started
- Component query API: https://vaadin.com/docs/latest/flow/testing/browserless/component-query
- Component testers: https://vaadin.com/docs/latest/flow/testing/browserless/component-testers
- Use the Vaadin MCP server for additional patterns
