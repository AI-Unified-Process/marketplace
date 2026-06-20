---
name: playwright-test
description: >
  Creates Playwright browser-based integration tests for Vaadin views using the
  Drama Finder library for type-safe element wrappers with accessibility-first APIs.
  Use when the user asks to "write Playwright tests", "create e2e tests", "write
  integration tests", "test in the browser", "write IT tests", or mentions
  end-to-end testing, browser tests, UI integration tests, Playwright for Vaadin,
  or Drama Finder. Also trigger when the user references a use case (UC-*) and
  asks for Playwright or E2E tests.
---

# Playwright Tests with Drama Finder

Create Playwright integration tests for the Vaadin view specified in $ARGUMENTS. Tests run in a real browser against a running application. Use the Drama Finder library for type-safe, accessibility-first element lookups — never raw Playwright locators.

## Setup

Tests extend `AbstractBasePlaywrightIT` from Drama Finder, which handles browser lifecycle, page creation, and Vaadin synchronization automatically.

```xml
<dependency>
    <groupId>org.vaadin.addons</groupId>
    <artifactId>dramafinder</artifactId>
    <version>1.1.0</version>
    <scope>test</scope>
</dependency>
```
## Important
- Do Blackbox Tests: Generate the tests against the running application (usually http://localhost:8080) and don't consider the implementation.

## DO NOT

- Use Mockito, access services/repositories/DSLContext directly
- Use raw Playwright locators like `page.locator("vaadin-text-field")` — use Drama Finder element wrappers
- Use `Thread.sleep()` or `page.waitForTimeout()` — Drama Finder assertions auto-retry
- Delete all data in cleanup — only remove data created during the test
- Assume all grid rows are rendered (viewport limits visible rows)
- Use XPath selectors (they don't pierce shadow DOM — CSS does)
- Use `getAttribute()`/`isVisible()` directly in assertions — they don't auto-retry
- Guess Drama Finder method signatures — look them up via the JavaDocs MCP when configured, otherwise consult the Drama Finder API docs linked below

## Test Data

Use existing test data from Flyway migrations in `src/test/resources/db/migration`. If your test creates data, clean up in `@AfterEach`.

## Template

Use [templates/ExampleViewIT.java](templates/ExampleViewIT.java) as the starting point for new test classes.

## Locating Components

Drama Finder uses ARIA roles and accessible names — not CSS selectors. This makes tests resilient to DOM changes and enforces accessibility. 
API documentation of Drama Finder: [https://parttio-dramafinder-4.mintlify.app/api/vaadin-element](https://parttio-dramafinder-4.mintlify.app/api/vaadin-element)

### By Label (input fields, pickers)

```java
TextFieldElement nameField = TextFieldElement.getByLabel(page, "Full Name");
DatePickerElement birthDate = DatePickerElement.getByLabel(page, "Birth Date");
ComboBoxElement country = ComboBoxElement.getByLabel(page, "Country");
CheckboxElement active = CheckboxElement.getByLabel(page, "Active");
```

### By Text (buttons, tabs)

```java
ButtonElement save = ButtonElement.getByText(page, "Save");
```

### By ID (grids, specific components)

```java
GridElement grid = GridElement.getById(page, "customer-grid");
```

### First on Page

```java
GridElement grid = GridElement.get(page);
DialogElement dialog = new DialogElement(page);
NotificationElement notif = new NotificationElement(page);
```

### By Header Text (dialogs)

```java
DialogElement dialog = DialogElement.getByHeaderText(page, "Confirm Delete");
```

### Scoped Lookups (within containers)

When multiple elements share the same label, scope the lookup to a container:

```java
DialogElement dialog = DialogElement.getByHeaderText(page, "Edit Person");
TextFieldElement name = TextFieldElement.getByLabel(dialog.getLocator(), "Name");
ButtonElement confirm = ButtonElement.getByText(dialog.getLocator(), "Confirm");
```

For icon-only buttons, set `setAriaLabel("Close")` on the server side, then find with `ButtonElement.getByText(page, "Close")`.

## Drama Finder API Lookup

If the **JavaDocs MCP server** (`https://www.javadocs.dev/mcp`) is configured, use it to look up Drama Finder element classes, methods, and assertions. Do NOT guess method signatures — verify with the JavaDocs MCP when available, or with the Drama Finder API docs (linked above) otherwise. See [the MCP setup rule](../../rules/mcp-servers.md) to configure this optional server.

**Maven coordinates:** groupId=`org.vaadin.addons`, artifactId=`dramafinder`, version=`1.1.0`

### Step 1: List available element classes

Call `get_javadoc_content_list` with the coordinates above to see all available element and base classes.

### Step 2: Look up specific element APIs

Call `get_javadoc_symbol_contents` with the `link` value from step 1 to get the full API for any element class (methods, parameters, return types, inherited methods).

### Step 3: Check base classes for shared methods

Many assertions and behaviors are defined in base/shared classes. Look these up when you need shared functionality:

- `PlaywrightElement` — core locator methods
- `HasValidationPropertiesElement` — `assertValid()`, `assertInvalid()`, `assertErrorMessage()`
- `HasValueElement` — `setValue()`, `getValue()`, `assertValue()`
- `HasEnabledElement` — `assertEnabled()`, `assertDisabled()`
- `FocusableElement` — `focus()`, `assertIsFocused()`
- `HasThemeElement` — `assertTheme()`
- `HasTooltipElement` — `assertTooltipHasText()`

### Locator levels

Each element has two locator levels:

- **`getLocator()`** — the component root. Use for: `theme`, `class`, `opened`, `invalid` attributes
- **`getInputLocator()`** — the internal input element. Use for: `value`, `maxlength`, `pattern`, `placeholder`, focus, disabled

CSS selectors pierce shadow DOM automatically. XPath does NOT.

### When to look up

- **Before writing any test**: look up the element classes you plan to use
- **When unsure about a method**: check the specific element class JavaDoc
- **When you need an element for an unfamiliar Vaadin component**: list contents to find the matching element class

## Workflow

1. Read the use case specification
2. Plan test scenarios (group related tests in `@Nested` classes with `@DisplayName`)
3. **Look up Drama Finder element APIs** for each element class you will use — via the JavaDocs MCP if configured, otherwise via the Drama Finder API docs
4. Create test class extending `AbstractBasePlaywrightIT` with `@SpringBootTest` and `@LocalServerPort`
5. Override `getUrl()` (return `http://localhost:<port>/`) and `getView()` (return the route)
6. For each test:
   - Use Drama Finder element wrappers to locate components by label/text/ID
   - Perform interactions (setValue, click, selectItem, check)
   - Assert outcomes using auto-retry assertions
   - Clean up test-created data in `@AfterEach`
7. Run tests with `./mvnw verify -Pit` to verify
8. On failure: check view loaded, verify test data in Flyway migrations, use `isGreaterThan()` for grid counts, add `waitForGridToStopLoading()` for async grids

## Troubleshooting

- **Element not found**: Check exact label text matches, ensure element is rendered, try scoped lookup
- **Multiple elements matched**: Factory methods use `.first()` automatically; scope to container for precision
- **Wrong locator type**: Use `getInputLocator()` for value/focus, `getLocator()` for component attributes
- **Flaky tests**: Replace any boolean checks with auto-retry assertions
- **Visual debugging**: `./mvnw verify -Pit -Dheadless=false -Dit.test=YourTestIT`
