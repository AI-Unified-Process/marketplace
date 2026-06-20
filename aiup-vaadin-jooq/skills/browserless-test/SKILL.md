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

If the Vaadin MCP server (`https://mcp.vaadin.com/docs`) is configured, use it for documentation lookups; otherwise rely on your own knowledge and the documentation links below. See [the MCP setup rule](../../rules/mcp-servers.md) to configure this optional server.

## Test Class Naming and `@UseCase` Annotation

Browserless tests are **use case tests**. Each test class verifies the behavior of exactly one use
case from the use case specification (`docs/use-cases/UC-XXX-*.md`).

### Class naming

Test classes must be named after the use case using the pattern
`UC<id><PascalCaseUseCaseName>Test` — for example `UC001RegisterPersonTest` for use case UC-001
"Register Person". This makes the link between spec and test obvious and is the convention the AIUP
IntelliJ Navigator plugin relies on.

### `@UseCase` annotation

Every test method must be annotated with `@UseCase(id = "UC-XXX", ...)` so the
[AIUP IntelliJ Navigator plugin](https://github.com/AI-Unified-Process/intellij-plugin) can wire up
gutter icons and Find Usages between the Markdown spec and the Java tests.

**Bootstrap step.** Before writing any tests, check whether the project already contains an
annotation type named `UseCase` (search the project for `@interface UseCase`). If it does not,
create it. The package does not matter — the plugin resolves the annotation by short name — but a
conventional location is `src/main/java/<group>/<artifact>/usecase/UseCase.java`. The annotation
must have exactly this shape:

```java
package com.example.app.usecase;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface UseCase {
    String id();

    String scenario() default "Main Success Scenario";

    String[] businessRules() default {};
}
```

### Usage on test methods

Annotate each test method with the use case ID and (when applicable) the scenario and business
rules it covers. The values must match headings in the corresponding `UC-XXX-*.md` spec:

| Attribute       | Maps to spec heading                       | Default                  |
|-----------------|--------------------------------------------|--------------------------|
| `id`            | `**Use Case ID:** UC-XXX`                  | (required)               |
| `scenario`      | `## Main Success Scenario` or `### A1: …`  | `"Main Success Scenario"` |
| `businessRules` | `### BR-XXX` headings inside the same UC   | `{}`                     |

```java
@Test
@UseCase(id = "UC-001")
void register_person_with_valid_data() { ... }

@Test
@UseCase(id = "UC-001", scenario = "A1: Email Already Exists")
void registration_fails_when_email_already_exists() { ... }

@Test
@UseCase(id = "UC-001", scenario = "A2: Invalid Postal Code", businessRules = {"BR-003"})
void registration_fails_when_postal_code_invalid() { ... }
```

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

Use [templates/UC001ManagePersonsTest.java](templates/UC001ManagePersonsTest.java) as the test
class structure. It demonstrates the `UC<id><Name>Test` class naming, the `@UseCase` annotation on
every test method, and how to map alternative flows (`scenario = "A1: …"`) and business rules
(`businessRules = {"BR-…"}`) onto the spec headings.

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

1. Read the use case specification (`docs/use-cases/UC-XXX-*.md`) to identify the main success
   scenario, alternative flows (A1, A2, …), and referenced business rules (BR-XXX)
2. Check whether a `UseCase` annotation type already exists in the project. If not, create
   `UseCase.java` with the canonical shape shown above
3. Use TodoWrite to create a task for each test scenario (one task per scenario / alternative flow)
4. Create the test class named `UC<id><PascalCaseUseCaseName>Test`, extending
   `SpringBrowserlessTest` and annotated `@SpringBootTest`
5. For each test method:
    - Annotate with `@UseCase(id = "UC-XXX", scenario = "…", businessRules = {"BR-…"})`
      mirroring the spec headings
    - Navigate to the view with `navigate(...)`
    - Find components with `$()` / `$view()`
    - Perform interactions through `test(component)`
    - Assert outcomes against the component's Java API
    - Clean up test data if created during the test
6. Run tests to verify they pass
7. If a test fails:
    - Use `$()...exists()` to verify the component is in the tree
    - Use `getCurrentView()` to confirm navigation succeeded
    - Verify test data exists in the Flyway test migrations
    - For overlay components, use the dedicated tester (`ContextMenuTester`, `MenuBarTester`) — `$()` won't see them
8. Mark todos complete

## Resources

- Vaadin Browserless documentation: https://vaadin.com/docs/latest/flow/testing/browserless
- Getting started: https://vaadin.com/docs/latest/flow/testing/browserless/getting-started
- Component query API: https://vaadin.com/docs/latest/flow/testing/browserless/component-query
- Component testers: https://vaadin.com/docs/latest/flow/testing/browserless/component-testers
- AIUP IntelliJ Navigator plugin (defines the `@UseCase` annotation contract): https://github.com/AI-Unified-Process/intellij-plugin
- If configured, use the Vaadin MCP server for additional patterns (`https://mcp.vaadin.com/docs`)
