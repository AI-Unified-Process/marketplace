---
name: vitest-test
description: >
  Creates Vitest + React Testing Library component tests for React views
  covering rendering, form interactions, and API-driven state, with mocked
  network requests via MSW. Use when the user asks to "write frontend tests",
  "test the React component", "write a Vitest test", "unit test a React page",
  or mentions React Testing Library, MSW, jsdom, or component testing for this
  stack.
---

# Vitest Test

## Instructions

Create Vitest component tests for the React view/component covering the use
case $ARGUMENTS. Vitest runs the component tree in `jsdom` — no real browser —
the frontend equivalent of a server-side unit test: fast, no browser process,
but still exercises real rendering and real user interaction.

## Test Naming and Use Case Traceability

These are **use case tests**, same intent as the backend's `@UseCase`
annotation — but TypeScript has no annotation mechanism the AIUP IntelliJ
Navigator plugin resolves, so don't claim that integration. Use a plain naming
convention instead:

- File name: `UC-XXX-<slug>.test.tsx`, colocated with the component under test.
- Top-level `describe` block named after the use case: `describe('UC-XXX: <Use Case Name>', ...)`.
- Each `it`/`test` title should read as the scenario it covers, matching the
  spec heading text: `'main scenario - loads and displays the list'`,
  `'A1: shows an error message when the request fails'`.

```tsx
describe("UC-010: Browse Product Catalog", () => {
    it("main scenario - loads and displays products", async () => {
        /* ... */
    });

    it("A1: filters products by category", async () => {
        /* ... */
    });

    it("A2: shows an empty state when no products match", async () => {
        /* ... */
    });
});
```

## DO NOT

- Hand-roll `vi.fn()` stubs for `fetch`/the API client that drift from the
  real request/response contract — intercept at the network boundary with MSW
- Query by CSS class or `container.querySelector` as a first resort — query
  the way a user/screen-reader would
- Use `act()` directly — Testing Library's `render`/`fireEvent`/`userEvent`
  already wrap it
- Assert on implementation details (internal state, prop values) instead of
  rendered output
- Snapshot entire components as the primary assertion — snapshots don't
  document intent and rot silently

## Setup

```bash
npm install -D vitest @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom msw
```

`vite.config.ts` / `vitest.config.ts`:

```ts
export default defineConfig({
    test: {
        environment: "jsdom",
        setupFiles: ["./src/test/setup.ts"],
    },
});
```

`src/test/setup.ts`:

```ts
import "@testing-library/jest-dom/vitest";
```

## Mocking the API with MSW

Intercept HTTP requests at the network layer so the component's real `fetch`
call and the real TanStack Query cache behavior run unmodified — only the
server response is faked.

```tsx
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { render, screen } from "@testing-library/react";
import { RoomTypeList } from "./RoomTypeList";

const server = setupServer(
    http.get("/api/room-types", () =>
        HttpResponse.json([{ id: 1, name: "Deluxe Suite", capacity: 2, price: 199.0 }])
    )
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

it("main scenario - loads and displays room types", async () => {
    render(<RoomTypeList/>);

    expect(await screen.findByText("Deluxe Suite")).toBeInTheDocument();
});
```

For an alternative-flow test, override the handler for that one test:

```tsx
it("A1: shows an error message when the request fails", async () => {
    server.use(http.get("/api/room-types", () => HttpResponse.error()));

    render(<RoomTypeList/>);

    expect(await screen.findByRole("alert")).toHaveTextContent(/could not load/i);
});
```

If the project uses TanStack Query, wrap `render` in a `QueryClientProvider`
with a fresh `QueryClient` per test (retries disabled) so failed requests
don't retry and slow down the test.

## Locating Elements — Accessibility-First Queries

Prefer, in this order: `getByRole`, `getByLabelText`, `getByText`,
`getByPlaceholderText`, and only fall back to `data-testid` when no
accessible query exists (e.g. a purely decorative element).

```tsx
screen.getByRole("button", { name: "Save" });
screen.getByRole("textbox", { name: "Full Name" });
screen.getByLabelText("Country");
screen.getByText("Deluxe Suite");
screen.getByRole("alert");
```

## Form Interactions

Use `@testing-library/user-event`, not `fireEvent`, for realistic event
sequences (focus, keydown, input, blur):

```tsx
import userEvent from "@testing-library/user-event";

const user = userEvent.setup();

await user.type(screen.getByLabelText("Full Name"), "Jane Doe");
await user.selectOptions(screen.getByLabelText("Country"), "Switzerland");
await user.click(screen.getByRole("button", { name: "Save" }));
```

## Assertions Reference

Use `@testing-library/jest-dom` matchers via `expect`.

| Assertion Type   | Example                                                               |
|------------------|-----------------------------------------------------------------------|
| Element present  | `expect(screen.getByText("Deluxe Suite")).toBeInTheDocument()`        |
| Element absent   | `expect(screen.queryByText("Deluxe Suite")).not.toBeInTheDocument()`  |
| Async appearance | `expect(await screen.findByRole("alert")).toBeInTheDocument()`        |
| Field value      | `expect(screen.getByLabelText("Full Name")).toHaveValue("Jane Doe")`  |
| Disabled state   | `expect(screen.getByRole("button", { name: "Save" })).toBeDisabled()` |
| List item count  | `expect(screen.getAllByRole("listitem")).toHaveLength(3)`             |

## Workflow

1. Read the use case specification (`docs/use-cases/UC-XXX-*.md`) to identify
   the main success scenario, alternative flows (A1, A2, …), and referenced
   business rules (BR-XXX)
2. Create the test file `UC-XXX-<slug>.test.tsx` colocated with the component
3. Set up MSW handlers for the API endpoints the component calls, matching the
   real response shape the backend's DTO produces
4. For each scenario:
    - Render the component (wrapped in any providers the app uses — router,
      query client, theme)
    - Interact using `userEvent`
    - Assert outcomes using accessibility-first queries and `jest-dom` matchers
5. Run the tests to verify they pass
6. If a test fails:
    - Use `screen.debug()` to inspect the rendered DOM
    - Verify the MSW handler URL matches exactly what the component requests
    - Use `findBy*` (not `getBy*`) for anything that appears after an async
      request resolves

## Resources

- Vitest documentation: https://vitest.dev/guide/
- React Testing Library documentation: https://testing-library.com/docs/react-testing-library/intro/
- Testing Library query priority: https://testing-library.com/docs/queries/about/#priority
- MSW documentation: https://mswjs.io/docs/
- If `aiup-core` is installed, its context7 MCP server covers Vitest/Testing Library/MSW docs —
  see [the MCP setup rule](../../rules/mcp-servers.md)
