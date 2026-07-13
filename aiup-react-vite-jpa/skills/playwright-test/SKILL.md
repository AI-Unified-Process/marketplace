---
name: playwright-test
description: >
  Creates Playwright browser-based end-to-end tests for React views using
  Playwright's native accessibility-first locators (getByRole, getByLabelText,
  getByText). Use when the user asks to "write Playwright tests", "create e2e
  tests", "write integration tests", "test in the browser", or mentions
  end-to-end testing, browser tests, or UI integration tests for this stack.
  Also trigger when the user references a use case (UC-*) and asks for
  Playwright or E2E tests.
---

# Playwright Tests

Create Playwright end-to-end tests for the React view specified in
$ARGUMENTS. Tests run in a real browser against the running application — both
the Vite dev/preview server (frontend) and the Spring Boot backend must be up,
since this is a split client/server architecture and the browser only ever
talks to the frontend origin, which proxies API calls to the backend.

Use Playwright's own locators (`getByRole`, `getByLabelText`, `getByText`) —
they are accessibility-first by default and work directly against React's
plain HTML/ARIA output. Unlike a Vaadin app (whose web components live behind
shadow DOM and need a wrapper library), a React app rendered with semantic
HTML needs no additional locator library.

## Important

- Do Blackbox Tests: generate the tests against the running application
  (frontend default: `http://localhost:5173` for Vite dev, or the preview
  port) and don't consider the implementation.

## DO NOT

- Use CSS selectors like `page.locator(".btn-save")` — use role/label/text
  locators
- Use `page.waitForTimeout()` or `Thread.sleep()`-equivalents — Playwright's
  locator assertions (`expect(locator).toBeVisible()`, etc.) auto-retry
- Delete all data in cleanup — only remove data created during the test
- Use XPath selectors
- Assume all list/grid rows are rendered — virtualized lists may only render
  the visible viewport
- Reference component internals (class names, file paths) in test code or
  assertions — this is a blackbox test against the rendered page

## Test Data

Use existing test data from Flyway migrations in
`src/test/resources/db/migration` (backend project). If your test creates
data, clean it up in an `afterEach`/`test.afterEach` hook, ideally through the
API rather than a raw DB call.

## Setup

```bash
npm install -D @playwright/test
```

```ts
// playwright.config.ts
import { defineConfig } from "@playwright/test";

export default defineConfig({
    testDir: "./tests/e2e",
    use: {
        baseURL: "http://localhost:5173",
    },
});
```

## Test Class / File Naming and Traceability

Group tests for one use case in a `test.describe` block named after the use
case, and tag each test with the use case ID using Playwright's built-in tag
mechanism — the frontend-testing equivalent of the backend's `@UseCase`
annotation.

```ts
import { test, expect } from "@playwright/test";

test.describe("UC-010: Browse Product Catalog", () => {
    test("main scenario - grid loads products", { tag: "@UC-010" }, async ({ page }) => {
        await page.goto("/products");

        await expect(page.getByRole("heading", { name: "Product Catalog" })).toBeVisible();
        await expect(page.getByRole("row")).not.toHaveCount(0);
    });

    test("A1: filters products by category", { tag: "@UC-010" }, async ({ page }) => {
        await page.goto("/products");

        await page.getByLabel("Category").selectOption("Electronics");

        await expect(page.getByRole("row")).toHaveCount(4); // header + 3 matching rows
    });
});
```

Run a single use case's tests with `npx playwright test --grep "@UC-010"`.

## Locating Elements

```ts
// By role and accessible name — buttons, links, headings, form controls
page.getByRole("button", { name: "Save" });
page.getByRole("textbox", { name: "Full Name" });
page.getByRole("row");

// By label — form fields
page.getByLabel("Country");

// By visible text
page.getByText("Deluxe Suite");

// By test id — only when no accessible query exists
page.getByTestId("product-grid");

// Scoped to a container (e.g. a dialog)
const dialog = page.getByRole("dialog", { name: "Edit Person" });
await dialog.getByLabel("Name").fill("Jane Doe");
```

## Common Interactions

```ts
await page.getByLabel("Full Name").fill("Jane Doe");
await page.getByLabel("Country").selectOption("Switzerland");
await page.getByRole("checkbox", { name: "Active" }).check();
await page.getByRole("button", { name: "Save" }).click();
```

## Assertions Reference

Use Playwright's auto-retrying `expect(locator)` assertions — never read
state with a plain boolean check.

| Assertion Type       | Example                                                                   |
|----------------------|---------------------------------------------------------------------------|
| Visible              | `await expect(page.getByText("Saved")).toBeVisible()`                     |
| Not visible          | `await expect(page.getByText("Saved")).not.toBeVisible()`                 |
| Text content         | `await expect(locator).toHaveText("Deluxe Suite")`                        |
| Row/item count       | `await expect(page.getByRole("row")).toHaveCount(4)`                      |
| Field value          | `await expect(page.getByLabel("Full Name")).toHaveValue("Jane Doe")`      |
| Enabled/disabled     | `await expect(page.getByRole("button", { name: "Save" })).toBeDisabled()` |
| URL after navigation | `await expect(page).toHaveURL(/\/products\/42$/)`                         |

## Workflow

1. Read the use case specification
2. Plan test scenarios (group related tests in a `test.describe` block per use case)
3. Create the test file under `tests/e2e/`
4. For each test:
    - Tag it with `{ tag: "@UC-XXX" }`
    - Navigate with `page.goto(...)`
    - Locate elements with role/label/text locators
    - Perform interactions (`fill`, `click`, `selectOption`, `check`)
    - Assert outcomes using auto-retrying `expect(locator)` assertions
    - Clean up test-created data in `test.afterEach`, ideally via the API
5. Run tests with `npx playwright test` to verify
6. On failure: confirm both the backend and frontend dev servers are running,
   verify test data exists in the Flyway migrations, use
   `npx playwright test --debug` or `--headed` for visual debugging

## Troubleshooting

- **Element not found**: check the exact accessible name/label text, ensure
  the element is rendered (not conditionally hidden), scope the locator to a
  container if multiple matches exist
- **Flaky tests**: replace any manual boolean check with an auto-retrying
  `expect(locator)...` assertion
- **Backend not reachable**: confirm the Vite dev server's proxy config (or
  the preview server) actually forwards `/api/*` to the running Spring Boot
  backend
- **Visual debugging**: `npx playwright test --headed --debug tests/e2e/products.spec.ts`
