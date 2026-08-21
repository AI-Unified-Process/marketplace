<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# Project layout detection

This is a lookup used by `/implement`, `/drizzle-migration`, `/nest-test`, `/react-test`, and
`/playwright-test` before writing any code. Its job is to answer one question: **where do this
project's two applications live, and which of its conventions must new code match?**

Never assume — always run this detection first. Two of the answers are unforgiving:

- Get **ESM/NodeNext** wrong and nothing compiles. A NodeNext project requires a `.js` suffix on
  every relative import even though the source file is `.ts`. Omit it and the build fails; add it
  in a project that isn't NodeNext and the build fails the other way.
- Get **router style** wrong and you silently create a second, conflicting router. A `src/pages`
  directory in an App Router project is not inert — Next.js will try to route it.

The rest are less dramatic but produce code that reads as foreign to the project: queries in the
wrong layer, types duplicated instead of shared, pages split across two conventions.

## The detection table

| # | Question | Signal | Consequence if wrong |
|---|----------|--------|----------------------|
| 1 | API app root | The workspace whose `package.json` has `@nestjs/core` in `dependencies` | Code lands in the wrong app |
| 2 | Web app root | The workspace whose `package.json` has `next` in `dependencies` | Code lands in the wrong app |
| 3 | ESM/NodeNext | `"type": "module"` in the API's `package.json` **and** `"module": "NodeNext"` (or `"Node16"`) in its `tsconfig.json` | Missing `.js` suffixes; nothing compiles |
| 4 | Drizzle config | `drizzle.config.ts` in the API root — read `schema` and `out` | Schema edits in the wrong file; migrations in the wrong directory |
| 5 | Router style | `src/app/` present → App Router; `src/pages/` present → Pages Router | A second conflicting router |
| 6 | Route indirection | Whether existing `src/app/**/page.tsx` files hold the page markup or re-export a component from elsewhere | Convention split across the codebase |
| 7 | Shared contract package | A workspace package imported by both apps that exports request/response types | Duplicated, drifting types |

## Step 1 — Find the applications

Read the repo-root `package.json` and look for `workspaces`. Expand each glob and read every
matched `package.json` to answer questions 1 and 2.

```bash
node -e "console.log(require('./package.json').workspaces)"
```

A monorepo commonly puts the two apps at `apps/api` and `apps/web`, but the names are arbitrary —
resolve them from the dependency signals, not from the directory names.

If there is no `workspaces` field, the two applications may be separate repositories or plain
sibling directories. Search for `nest-cli.json` and `next.config.*` instead. **State which roots
you found before writing anything**, so a wrong guess is visible immediately rather than after a
dozen files have landed in the wrong place.

## Step 2 — Resolve the ESM question before writing a single import

```bash
node -e "const p=require('./<api>/package.json'); console.log(p.type)"
grep -E '"module"|"moduleResolution"' <api>/tsconfig.json
```

`"type": "module"` together with `"module": "NodeNext"` means **every relative import specifier
ends in `.js`**:

```ts
import { ProductsService } from './products.service.js';   // correct — source is .ts
import { ProductsService } from './products.service';      // fails to resolve at runtime
```

The quickest confirmation is the project's own code: open any existing file with a relative import
and copy what it does. If existing imports carry `.js`, yours must too.

## Step 3 — Locate the Drizzle configuration

Read `drizzle.config.ts` in the API root. Two fields matter:

- `schema` — the file to edit when the entity model changes (commonly `./src/database/schema.ts`)
- `out` — the directory generated migrations land in (commonly `./drizzle/migrations`)

Never infer either from convention. A project that keeps its schema split across several files
under a `schema/` directory is normal, and writing into a single `schema.ts` that the config does
not point at produces a table that never reaches the database.

## Step 4 — Determine the frontend's routing and indirection conventions

`src/app/` means App Router. Then check what a route file actually contains:

```tsx
// Direct — the route file holds the page
export default function ProductsPage() {
  return <main>…</main>;
}
```

```tsx
// Indirect — the route file is a thin wrapper
'use client';
import { ProductsPage } from '../../views/ProductsPage';
export default function Page() {
  return <ProductsPage />;
}
```

Where the project uses indirection, new pages follow it: a thin wrapper at the route, the markup in
a component beside its siblings. This matters beyond `/implement` — `/react-test` must target the
component that holds the markup, because a test rendering the wrapper asserts nothing.

Note that a directory named `views` (or `screens`, or `containers`) is a deliberate choice to avoid
`src/pages`, which the Pages Router would claim. Do not "tidy" it into `src/pages`.

## Step 5 — Before writing new code, imitate an existing feature

Find one already-implemented feature and copy its exact shape rather than generating from this
table in isolation. The table tells you where things live; an existing feature tells you how this
team writes them.

- **Repository ownership**: does each feature folder carry its own `*.repository.ts`, or do features
  consume shared repositories exported by a core module? Match whichever exists — importing a shared
  repository where one exists is correct; duplicating its queries into a new file is not.
- **Response shapes**: are they hand-written per feature under `dto/`, or imported from a shared
  contract package? If a shared package exists, use it; the whole point is that both halves of the
  stack change together.
- **Request validation**: are route params and query strings bound through class-validator DTOs, or
  through custom pipes? Custom pipes usually exist because the project cares about the exact error
  message they produce — preserve them rather than replacing them with a generic DTO.
- **Frontend data access**: is there a fetch-client module (`apiGet`/`apiPost` or similar) and a
  hook wrapping it? Use them. A bare `fetch` in a project that has a client module bypasses its
  error handling and base-path logic.

## Step 6 — First-ever feature (nothing to imitate yet)

If the project has no implemented feature to copy, fall back to these documented defaults rather
than inventing a structure:

- A feature-owned `*.repository.ts` inside the feature folder.
- Response shapes as plain exported types under the feature's `dto/` directory.
- class-validator DTOs for query and body; no custom pipes.
- Page components directly in `src/app/**/page.tsx`, with no separate view directory.
- Bare `fetch` against relative `/api/...` paths.

Say which defaults you applied, so the first feature's conventions are a visible decision rather
than an accident the rest of the codebase then inherits.

## Reference chain

```
src/app/<route>/page.tsx           (web — thin wrapper, or the page itself)
  → <view component>                (web — markup, state, data fetching)
    → fetch / apiGet('/api/<resource>')
      ⇢ rewrite in next.config.ts ⇢ http://<api-host>/api/<resource>

<Feature>Controller                 (api — routing, DTO binding; no logic)
  → <Feature>Service                (api — orchestration; throws domain errors)
    → <Feature>Repository           (api — every Drizzle query lives here)
      → schema.ts                   (api — the tables, owned by /drizzle-migration)
  ← <Feature>Response               (api — mapped shape, never a raw row)
```

Never let a Drizzle query escape the repository, and never let a raw database row reach the
controller's return type — those two boundaries are what make the backend testable in two tiers.
