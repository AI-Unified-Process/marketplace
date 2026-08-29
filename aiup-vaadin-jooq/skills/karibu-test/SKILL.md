---
name: karibu-test
description: >
  Creates Karibu server-side unit tests for Vaadin views covering navigation,
  component interactions, form validation, grid operations, and notifications.
  Use when the user asks to "write Karibu tests", "unit test a Vaadin view",
  "test the UI server-side", "create view tests", or mentions Karibu testing,
  Vaadin unit tests, or server-side UI testing.
---

<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# Karibu Test

> **Legacy skill — no longer recommended for new code.** Since Vaadin 25.1 the official Vaadin Browserless Testing
> framework (`com.vaadin:browserless-test-junit6`) is free and open source under Apache 2.0. It supersedes the
> community Karibu Testing library. Prefer **`/browserless-test`** for new test classes. Use this skill only when
> extending an existing Karibu-based test suite.

## Instructions

Create Karibu unit tests for Vaadin views based on the use case $ARGUMENTS. Karibu Testing allows server-side testing of Vaadin components without a browser.

If the KaribuTesting MCP server (`https://karibu-testing-mcp.martinelli.ch/mcp`) is configured, use it for documentation and code generation; otherwise rely on your own knowledge and the documentation links below. See [the MCP setup rule](../../rules/mcp-servers.md) to configure this optional server.

## If Tests for This Use Case Already Exist

A diff of the specification change may follow the file path in the arguments. When it is there, it
is the definitive list of what changed — work through it change by change. A removed line means the
scenario it described was dropped: delete the tests that exist only for it instead of keeping them
as passing extras.

Before writing new tests, look for an existing test class for this use case — search for
`UC<id>*Test` and for methods annotated `@UseCase(id = "UC-XXX")`. If one exists, **update it to
match the current specification instead of creating a second test class**:

- Add test methods for scenarios and business rules the spec has gained since the tests were written
- Update existing test methods whose expected values, labels, component captions, or flows the spec
  has changed
- Delete tests for scenarios the spec no longer contains
- Leave passing tests the spec still requires untouched
- Update the test data (Flyway test migrations) when the spec's data requirements changed
- Run the whole test class afterwards, not only the methods you added

## Test Class Naming and `@UseCase` Annotation

Karibu tests are **use case tests**. Each test class verifies the behavior of exactly one use case
from the use case specification (`docs/use-cases/UC-XXX-*.md`).

### Class naming

Test classes must be named after the use case using the pattern
`UC<id><PascalCaseUseCaseName>Test` — for example `UC001RegisterPersonTest` for use case UC-001
"Register Person". This is the convention the AI Unified Process IntelliJ Navigator plugin relies on to link
specs and tests.

### `@UseCase` annotation

Every test method must be annotated with `@UseCase(id = "UC-XXX", ...)` so the
[AI Unified Process IntelliJ Navigator plugin](https://github.com/AI-Unified-Process/intellij-plugin) can wire up
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

Use [references/UC001ManagePersonsTest.java](references/UC001ManagePersonsTest.java) as the test
class structure. It demonstrates the `UC<id><Name>Test` class naming, the `@UseCase` annotation on
every test method, and how to map alternative flows (`scenario = "A1: …"`) and business rules
(`businessRules = {"BR-…"}`) onto the spec headings.

## Common Patterns

### Navigate to View

```java
UI.getCurrent().navigate(PersonView.class);
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
assertThat(GridKt._size(grid)).isEqualTo(100);

// Get selected items
Set<PersonRecord> selected = grid.getSelectedItems();

// Select a row
GridKt._selectRow(grid, 0);

// Get cell component (for action buttons)
GridKt._getCellComponent(grid, 0, "actions")
    .getChildren()
    .filter(Button.class::isInstance)
    .findFirst()
    .map(Button.class::cast)
    .ifPresent(Button::click);

// Get cell value
String name = GridKt._getFormattedRow(grid, 0).get("name");
```

### Form Interactions

```java
// Set field values
_get(TextField.class, spec -> spec.withLabel("Name"))._setValue("John");
_get(ComboBox.class, spec -> spec.withLabel("Country"))._setValue(country);
_get(DatePicker.class, spec -> spec.withLabel("Birth Date"))._setValue(LocalDate.of(1990, 1, 1));

// Click button
_get(Button.class, spec -> spec.withCaption("Save"))._click();
```

### Notification Assertions

```java
// Expect notification
expectNotifications("Record saved successfully");

// Assert no notifications
assertThat(NotificationsKt.getNotifications()).isEmpty();
```

### ConfirmDialog

```java
// Click confirm in dialog
ConfirmDialogKt._fireConfirm(_get(ConfirmDialog.class));

// Click cancel
ConfirmDialogKt._fireCancel(_get(ConfirmDialog.class));
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

1. Read the use case specification (`docs/use-cases/UC-XXX-*.md`) to identify the main success
   scenario, alternative flows (A1, A2, …), and referenced business rules (BR-XXX)
2. Check whether a `UseCase` annotation type already exists in the project. If not, create
   `UseCase.java` with the canonical shape shown above
3. Look for an existing test class for this use case. If there is one, follow "If Tests for This
   Use Case Already Exist" above and reconcile it with the spec instead of creating a new class
4. Use TodoWrite to create a task for each test scenario (one task per scenario / alternative flow)
5. Create the test class named `UC<id><PascalCaseUseCaseName>Test` using the template (or open the
   existing one)
6. For each test method:
    - Annotate with `@UseCase(id = "UC-XXX", scenario = "…", businessRules = {"BR-…"})`
      mirroring the spec headings
    - Navigate to the view
    - Find components using LocatorJ
    - Perform interactions
    - Assert expected outcomes
    - Clean up test data if created during the test
7. Run tests to verify they pass
8. If a test fails:
    - Check component locators with `_dump()` to inspect the component tree
    - Verify test data exists in the Flyway test migrations
    - Ensure navigation to the correct view before finding components
9. Mark todos complete
10. Report the result and hand off to `/coverage-check UC-XXX` — see
   [Coverage Check](#coverage-check) below

## Resources

- Karibu Testing documentation: https://github.com/mvysny/karibu-testing/tree/master/karibu-testing-v10
- AI Unified Process IntelliJ Navigator plugin (defines the `@UseCase` annotation contract): https://github.com/AI-Unified-Process/intellij-plugin
- If configured, use the KaribuTesting MCP server for additional patterns (`https://karibu-testing-mcp.martinelli.ch/mcp`)

## Coverage Check

Do **not** run the `uc-coverage` sub-agent from this skill, and do not audit the tests against the
specification yourself. The audit is a separate, explicit step that belongs to
[`/coverage-check`](../coverage-check/SKILL.md): it judges implementation and tests together in
one matrix, and it is the only audit behind a justified `**Status:** Tested`.

Finish instead by:

- Summarising which tests you wrote and whether the suite passes, with the test command you ran.
- Ending with one hand-off line: `Next: /coverage-check UC-XXX`. If the test class is
  still unfinished, suggest `/coverage-check UC-XXX tests wip` so the audit lists remaining work
  instead of defects.
- Leaving the specification's `**Status:**` line alone; the audit suggests the next value.

Running the audit here would triple it — once after implementation, once after tests, once in
`/coverage-check`. Each run re-reads the specification and the code base and takes minutes; one
run at the end, in `both` mode, is the one that counts. Whether to run it now, later, or not at
all is the user's call.
