---
name: playwright-test
description: >
  Creates Playwright browser-based end-to-end tests for Angular views using
  Playwright's native accessibility-first locators (getByRole, getByLabelText,
  getByText). Use when the user asks to "write Playwright tests", "create e2e
  tests", "write integration tests", "test in the browser", or mentions
  end-to-end testing, browser tests, or UI integration tests for this stack.
  Also trigger when the user references a use case (UC-*) and asks for
  Playwright or E2E tests.
---

# Playwright Tests

Create Playwright end-to-end tests for the Angular view specified in
$ARGUMENTS. Tests run in a real browser against the running application — both
the Angular dev server (frontend) and the Spring Boot backend must be up,
since this is a split client/server architecture and the browser only ever
talks to the frontend origin, which proxies API calls to the backend.
If the angular-cli MCP server is configured, its `devserver.start`/`devserver.wait_for_build`
tools can launch the Angular dev server and confirm it finished building before tests run,
instead of assuming it's already up.

Use Playwright's own locators (`getByRole`, `getByLabelText`, `getByText`) —
they are accessibility-first by default and work directly against Angular's
plain HTML/ARIA output. Unlike a Vaadin app (whose web components live behind
shadow DOM and need a wrapper library), an Angular app rendered with semantic
HTML needs no additional locator library.

## Important — This Is a Green-Field Decision

Check `package.json` devDependencies and the repo root for an existing
`cypress.config.ts`, `protractor.conf.js`, or `e2e/`/`cypress/` folder before
scaffolding anything. Projects on this stack commonly have **no e2e tooling at
all yet** — if that's the case here, say so explicitly: this skill is making
the choice of Playwright on the user's behalf, not preserving an established
convention. If a different e2e framework is already configured, stop and flag
the conflict rather than silently adding a second one.

- Do Blackbox Tests: generate the tests against the running application
  (Angular CLI dev server default: `http://localhost:4200`) and don't consider
  the implementation.

## DO NOT

- Use CSS selectors like `page.locator(".btn-save")` — use role/label/text
  locators
- Use `page.waitForTimeout()` — Playwright's locator assertions
  (`expect(locator).toBeVisible()`, etc.) auto-retry
- Delete all data in cleanup — only remove data created during the test
- Use XPath selectors
- Assume all list/grid rows are rendered — virtualized lists may only render
  the visible viewport
- Reference component internals (class names, file paths) in test code or
  assertions — this is a blackbox test against the rendered page

## Test Data

Use existing test data from Flyway migrations (backend project — location
depends on the detected backend module layout, see the `implement` skill's
[`references/module-layout.md`](../implement/references/module-layout.md)). If
your test creates data, clean it up in a `test.afterEach` hook, ideally
through the API rather than a raw DB call.

## Setup

```bash
npm install -D @playwright/test
```

```ts
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './tests/e2e',
    use: {
        baseURL: 'http://localhost:4200',
    },
});
```

`tests/e2e/` is recommended for cross-plugin consistency with the sibling
React plugin's convention, but since e2e tooling is genuinely green-field
here, the Angular CLI's traditional `e2e/` folder at the project root is
equally acceptable — check for an existing preference before picking one.

## Test Class / File Naming and Traceability

Group tests for one use case in a `test.describe` block named after the use
case, and tag each test with the use case ID using Playwright's built-in tag
mechanism — the frontend-testing equivalent of the backend's `@UseCase`
annotation.

```ts
import { test, expect } from '@playwright/test';

test.describe('UC-010: Browse Room Type Catalog', () => {
    test('main scenario - grid loads room types', { tag: '@UC-010' }, async ({ page }) => {
        await page.goto('/room-types');

        await expect(page.getByRole('heading', { name: 'Room Types' })).toBeVisible();
        await expect(page.getByRole('row')).not.toHaveCount(0);
    });

    test('A1: filters by capacity', { tag: '@UC-010' }, async ({ page }) => {
        await page.goto('/room-types');

        await page.getByLabel('Minimum Capacity').fill('4');

        await expect(page.getByRole('row')).toHaveCount(3); // header + 2 matching rows
    });
});
```

Run a single use case's tests with `npx playwright test --grep "@UC-010"`.

## Locating Elements

```ts
// By role and accessible name — buttons, links, headings, form controls
page.getByRole('button', { name: 'Save' });
page.getByRole('textbox', { name: 'Full Name' });
page.getByRole('row');

// By label — form fields
page.getByLabel('Country');

// By visible text
page.getByText('Deluxe Suite');

// By test id — only when no accessible query exists
page.getByTestId('room-type-grid');
```

## Common Interactions

```ts
await page.getByLabel('Full Name').fill('Jane Doe');
await page.getByLabel('Country').selectOption('Switzerland');
await page.getByRole('checkbox', { name: 'Active' }).check();
await page.getByRole('button', { name: 'Save' }).click();
```

## Assertions Reference

Use Playwright's auto-retrying `expect(locator)` assertions — never read
state with a plain boolean check.

| Assertion Type       | Example                                                              |
|----------------------|----------------------------------------------------------------------|
| Visible              | `await expect(page.getByText("Saved")).toBeVisible()`                |
| Row/item count       | `await expect(page.getByRole("row")).toHaveCount(4)`                 |
| Field value          | `await expect(page.getByLabel("Full Name")).toHaveValue("Jane Doe")` |
| URL after navigation | `await expect(page).toHaveURL(/\/room-types\/42$/)`                  |

## Workflow

1. Check for an existing e2e framework before assuming Playwright is unclaimed
2. Read the use case specification
3. Plan test scenarios (group related tests in a `test.describe` block per use case)
4. Create the test file
5. For each test:
    - Tag it with `{ tag: "@UC-XXX" }`
    - Navigate with `page.goto(...)`
    - Locate elements with role/label/text locators
    - Perform interactions (`fill`, `click`, `selectOption`, `check`)
    - Assert outcomes using auto-retrying `expect(locator)` assertions
    - Clean up test-created data in `test.afterEach`, ideally via the API
6. Run tests with `npx playwright test` to verify
7. On failure: confirm both the backend and Angular dev server are running,
   verify test data exists in the Flyway migrations, use
   `npx playwright test --debug` or `--headed` for visual debugging

## Troubleshooting

- **Element not found**: check the exact accessible name/label text, ensure
  the element is rendered (not conditionally hidden)
- **Flaky tests**: replace any manual boolean check with an auto-retrying
  `expect(locator)...` assertion
- **Backend not reachable**: confirm the Angular dev server's proxy config
  (`proxy.conf.json`) actually forwards `/api/*` to the running Spring Boot
  backend
- **Visual debugging**: `npx playwright test --headed --debug tests/e2e/room-types.spec.ts`

## Resources

- Playwright documentation: https://playwright.dev/docs/intro
- If configured, use the playwright MCP server for browser automation assistance
- If configured, use the angular-cli MCP server's `devserver.start`/`.stop`/`.wait_for_build`
  to manage the Angular dev server, and `search_documentation` for Angular-specific questions
- See [the MCP setup rule](../../rules/mcp-servers.md) to configure these optional servers
