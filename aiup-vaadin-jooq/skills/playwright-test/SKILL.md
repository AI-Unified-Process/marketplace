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
- Guess Drama Finder method signatures — use the bundled [references/dramafinder-api.md](references/dramafinder-api.md); only fall back to the JavaDocs MCP for classes it doesn't cover

## Test Data

Use existing test data from Flyway migrations in `src/test/resources/db/migration`. If your test creates data, clean up in `@AfterEach`.

## Template

Use [references/ExampleViewIT.java](references/ExampleViewIT.java) as the starting point for new test classes.

## Locating Components

Drama Finder uses ARIA roles and accessible names — not CSS selectors. This makes tests resilient to DOM changes and enforces accessibility.
The full element-class and method reference is bundled at [references/dramafinder-api.md](references/dramafinder-api.md).

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

The bundled [references/dramafinder-api.md](references/dramafinder-api.md) is the authoritative API reference — element classes, factory methods, shared mixin assertions, and the locator-level rules (`getLocator()` vs `getInputLocator()`). Consult it before writing any test; do NOT guess method signatures.

**Maven coordinates:** groupId=`org.vaadin.addons`, artifactId=`dramafinder`, version=`1.1.0`

If the bundled reference doesn't cover a class you need (or the dependency has been upgraded past `1.1.0`) and the **JavaDocs MCP server** is configured, look it up there and add it to the reference:

- `get_javadoc_content_list` with the coordinates above lists all element and base classes.
- `get_javadoc_symbol_contents` with a `link` from that list returns the full API for a class (methods, parameters, return types, inherited methods).

See [the MCP setup rule](../../rules/mcp-servers.md) to configure this optional server.

## Workflow

1. Read the use case specification
2. Plan test scenarios (group related tests in `@Nested` classes with `@DisplayName`)
3. **Look up Drama Finder element APIs** for each element class you will use in [references/dramafinder-api.md](references/dramafinder-api.md)
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
