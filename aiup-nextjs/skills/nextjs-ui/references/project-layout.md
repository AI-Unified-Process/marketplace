<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# Project layout detection

This is a lookup used by `/nextjs-ui` and `/nextjs-ui-test` before writing any code. It answers one question:
**where does the web application live, and which of its conventions must new code match?** It says nothing about
the backend: the API layer may be NestJS, Spring Boot, or anything else that speaks JSON over HTTP, and its contract
reaches this layer through the Handover.

Never assume; always run this detection first. Router style is the unforgiving answer: a `src/pages` directory in an
App Router project is not inert, because Next.js tries to route it.

## The detection table

| # | Question | Signal | Consequence if wrong |
|---|----------|--------|----------------------|
| 1 | Web app root | The UI row's Location in `docs/architecture/stack.md`; otherwise the workspace whose `package.json` has `next` in `dependencies` | Code lands in the wrong app |
| 2 | Router style | `src/app/` (or `app/`) present → App Router; `src/pages/` only → Pages Router | A second conflicting router |
| 3 | Route indirection | Whether existing `page.tsx` files hold the page markup or re-export a component from elsewhere | Convention split across the codebase |
| 4 | API rewrite | `rewrites()` in `next.config.*` | Requests that 404 in one environment |
| 5 | Fetch client | A module with `apiGet`/`apiPost` or similar, and any hook wrapping it | Error handling and base path bypassed |
| 6 | Shared contract package | A workspace package imported by the web app that exports request and response types | Duplicated, drifting types |
| 7 | Component library | shadcn/ui, Tailwind, `lucide-react`, or another library in `package.json` | A foreign look, a second library |

These skills build the App Router. In a Pages Router project, stop and report it: the conventions here do not apply.

## Step 1: Find the application

Read the UI row of `docs/architecture/stack.md`. Without one, read the repo-root `package.json`, expand each glob of
`workspaces`, and resolve the root from the dependency signal, not from a directory name. With no `workspaces` field,
search for `next.config.*`. **State the root you found before writing anything**, so a wrong guess is visible
immediately rather than after a dozen files have landed in the wrong place.

## Step 2: Determine the routing and indirection conventions

Check what a route file actually contains:

```tsx
// Direct: the route file holds the page
export default function ProductsPage() {
  return <main>…</main>;
}
```

```tsx
// Indirect: the route file is a thin wrapper
'use client';
import { ProductsPage } from '../../views/ProductsPage';
export default function Page() {
  return <ProductsPage />;
}
```

Where the project uses indirection, new pages follow it: a thin wrapper at the route, the markup in a component beside
its siblings. `/nextjs-ui-test` must target the component that holds the markup, because a test rendering the wrapper
asserts nothing.

A directory named `views` (or `screens`, or `containers`) is a deliberate choice to avoid `src/pages`, which the
Pages Router would claim. Do not "tidy" it into `src/pages`.

## Step 3: Check how the browser reaches the API

The browser calls relative `/api/...` paths, and a rewrite in `next.config.*` forwards them to the API origin. Read
the rewrite and compare it with the base path of the API contract section of the stack file. With no rewrite yet, add
one that reads the origin from an environment variable with a local default, and name the variable in your report:

```ts
// next.config.ts
const nextConfig = {
  async rewrites() {
    const origin = process.env.API_ORIGIN ?? 'http://localhost:3001';
    return [{ source: '/api/:path*', destination: `${origin}/api/:path*` }];
  },
};
export default nextConfig;
```

The default matters: without it an unset variable gives the destination `undefined/api/:path*` and `next build` stops
with `Invalid rewrite found`. **`next build` fixes the origin:** a rewrite is evaluated at build time, so changing
`API_ORIGIN` when starting the built application changes nothing. Set it at build time, one build per environment. A
project that ships one image to several environments needs the origin at runtime, through a Route Handler under
`src/app/api/` that forwards the request; that is a decision to ask about, not a default.

## Step 4: Before writing new code, imitate an existing feature

Find one implemented page and copy its shape. The table tells you where things live; an existing feature tells you
how this team writes them.

- **Contract types**: hand-written beside the feature, or imported from a shared package? The test is whether the
  *package* exists, not whether it already holds a type for this use case: a new response shape belongs there too.
- **Data access**: a fetch-client module and a hook wrapping it? Use them. A bare `fetch` in a project that has a
  client module bypasses its error handling and base-path logic.
- **Forms**: a form library such as `react-hook-form`, a schema library such as `zod`, or plain controlled state?
- **Rendering**: client components that fetch in the browser, or Server Components? See "Client and Server Components"
  of `/nextjs-ui`.

## Step 5: First-ever page (nothing to imitate yet)

Fall back to these defaults rather than inventing a structure, and say which ones you applied, so the first page's
conventions are a visible decision rather than an accident the rest of the codebase inherits:

- A client component directly in `src/app/<route>/page.tsx`, with no separate view directory.
- Contract types as plain exported types in `src/types/<entity>.ts`.
- Bare `fetch` against relative `/api/...` paths.
- Component state with `useState`; no form or state library.
