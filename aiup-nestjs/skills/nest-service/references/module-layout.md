<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# Module layout of a NestJS application

A lookup used by `/nest-service`, `/nest-rest`, their test skills, and the Drizzle skills before writing any code. It
answers one question: **where does the API application live, and which of its conventions must new code match?** The
`## Module layout` section of `docs/architecture/stack.md` wins where it records an answer; detect the rest.

Never assume. Get **ESM/NodeNext** wrong and nothing compiles: a NodeNext project requires a `.js` suffix on every
relative import even though the source file is `.ts`. Omit it and the build fails; add it in a project that is not
NodeNext and the build fails the other way.

## The detection table

| # | Question            | Signal                                                                                                              | Consequence if wrong                 |
|---|---------------------|---------------------------------------------------------------------------------------------------------------------|--------------------------------------|
| 1 | API app root        | The workspace whose `package.json` has `@nestjs/core` in `dependencies`; without workspaces, the folder of `nest-cli.json` | Code lands in the wrong app          |
| 2 | ESM/NodeNext        | `"type": "module"` in the API's `package.json` **and** `"module": "NodeNext"` (or `"Node16"`) in its `tsconfig.json` | Missing `.js` suffixes; nothing compiles |
| 3 | Shared contract package | A workspace package imported by the API and a client that exports request and response types                    | Duplicated, drifting types           |

## Step 1: Find the application

Read the repo-root `package.json` and look for `workspaces`. Expand each glob and read every matched `package.json`.

```bash
node -e "console.log(require('./package.json').workspaces)"
```

A monorepo commonly puts the application at `apps/api`, but the name is arbitrary: resolve it from the dependency, not
from the directory name. **State the root you found before writing anything**, so a wrong guess is visible at once.

## Step 2: Resolve the ESM question before writing a single import

```bash
node -e "const p=require('./<api>/package.json'); console.log(p.type)"
grep -E '"module"|"moduleResolution"' <api>/tsconfig.json
```

`"type": "module"` together with `"module": "NodeNext"` means **every relative import specifier ends in `.js`**:

```ts
import { ProductsService } from './products.service.js';   // correct: the source is .ts
import { ProductsService } from './products.service';      // fails to resolve
```

The quickest confirmation is the project's own code: open any file with a relative import and copy what it does. Test
files follow the same rule.

## Step 3: The feature folder

Every feature is a folder under `src/<feature>/` with the same anatomy:

```text
<feature>.module.ts        declares the controller and providers
<feature>.controller.ts    /nest-rest: routing, DTO binding; no business logic
<feature>.service.ts       /nest-service: business rules, orchestration, domain errors
<feature>.repository.ts    the persistence skill: all database access   [if the feature owns data]
dto/*.ts                   /nest-rest: class-validator request DTOs and response types
```

Register the module in the application's root module: a feature that compiles but is never imported produces a 404
that looks like a routing bug. Whichever layer creates the folder first creates `<feature>.module.ts`; the layers above
add their provider or controller to it.

## Step 4: Before writing new code, imitate an existing feature

Find one implemented feature and copy its exact shape. The table says where things live; an existing feature says how
this team writes them.

- **Repository ownership**: does each feature carry its own `*.repository.ts`, or do features consume shared
  repositories exported by a core module? Match whichever exists.
- **Response shapes**: hand-written per feature under `dto/`, or imported from a shared contract package? With a shared
  package, a new shape belongs there too, even when the package does not mention this use case yet.
- **Request validation**: class-validator DTOs, or custom pipes? Custom pipes usually exist because the project cares
  about the exact error they produce; keep them.
- **Errors**: the project's domain error classes and its exception filter. Never add a second hierarchy.
- **Where mapping happens**: when the existing services already return response types, new services do too.

## Step 5: First-ever feature (nothing to imitate yet)

Fall back to these defaults rather than inventing a structure, and say which ones you applied, so the first feature's
conventions are a visible decision:

- A feature-owned `*.repository.ts` inside the feature folder.
- Response shapes as plain exported types under the feature's `dto/` folder.
- class-validator DTOs for query and body; no custom pipes.
- `src/common/errors.ts` with the domain errors, mapped by one exception filter (`/nest-rest`).
- `ValidationPipe` and the exception filter registered with `APP_PIPE` and `APP_FILTER` in the root module rather than
  in `main.ts`, so a test application built from the root module has them too.

## Reference chain

```text
<Feature>Controller                 routing, DTO binding, mapping to the response type; no logic
  → <Feature>Service                business rules; throws domain errors
    → <Feature>Repository           every query lives here
      → schema                      the tables
  ← <Feature>Response               mapped shape, never a raw row
```

Never let a query escape the repository, and never let a raw database row reach the controller's return type.
