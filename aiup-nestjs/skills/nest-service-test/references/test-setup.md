<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# Test setup of a NestJS application

The one description of how the tests of a NestJS application run: read by `/nest-service-test`, `/nest-rest-test`, and
the persistence test skill. The E2E test skill brings its own description of the running application. An existing
setup of the project comes first: check each section, reuse what exists, add what is missing, and say which. Examples show a NodeNext project; drop the `.js` suffixes where
the layout detection found none.

## Vitest configuration: check this before writing a single test

This is the highest-value check, and it is invisible until it bites.

NestJS dependency injection resolves constructor parameters by reading `design:paramtypes` metadata, which needs
`emitDecoratorMetadata` in `tsconfig.json` **and** a transformer that honours it. Without one, every provider fails to
resolve, and the error names a parameter index rather than the cause, so it reads like a broken module, not a broken
build config. The Vite version under Vitest decides:

| Vite     | Default transformer | What the project needs                                                  |
|----------|---------------------|-------------------------------------------------------------------------|
| Below 8  | esbuild             | `unplugin-swc`: esbuild emits no decorator metadata                     |
| 8 and up | Oxc                 | Nothing: Oxc reads the setting from `tsconfig.json`. Add no SWC for it  |

Confirm the answer rather than trusting the table: the first spec that boots the application proves it, and only
that failure justifies a new dependency. Verified on Vite 8.3 with Vitest 4.1, where the suite behaved the same with
SWC, with SWC and `oxc: false`, and without either. An existing SWC setup stays.

```ts
// vitest.config.e2e.ts: the tests that run against the database
import swc from 'unplugin-swc'; // below Vite 8 only
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [swc.vite({ module: { type: 'es6' } })], // below Vite 8 only
  test: {
    globals: true,
    environment: 'node',
    include: ['test/**/*-spec.ts'],
    globalSetup: ['test/utils/global-setup.ts'],
    fileParallelism: false,
    hookTimeout: 120_000,
  },
});
```

The Nest generator writes this file for an ESM project from NestJS 12 on: extend it. Its `test/app.e2e-spec.ts` runs
under the wider `include` too and is left alone.

Adding `unplugin-swc`, `@swc/core`, `testcontainers`, or `supertest` is a new dependency: it follows the decision
rights of `/use-case-implement`, and the report names it.

`include` covers every spec against the database: `UC-XXX-<slug>.e2e-spec.ts` (API),
`UC-XXX-<slug>.service-spec.ts` (service), and `UC-XXX-<slug>.repository.e2e-spec.ts` (persistence). A project whose
existing include reads `test/**/*.e2e-spec.ts` picks up the repository specs already; widen it for the service specs. Pure unit specs stay in `src/**/*.spec.ts` under the project's `vitest.config.ts`, which needs the
same transformer as soon as one of them imports a decorated class.

## The Testcontainers lifecycle

One container for the whole run, started in global setup and published to the test files:

```ts
// test/utils/global-setup.ts
import { PostgreSqlContainer } from '@testcontainers/postgresql';
import type { TestProject } from 'vitest/node';

export default async function setup(project: TestProject): Promise<() => Promise<void>> {
  const container = await new PostgreSqlContainer('postgres:17-alpine').start();
  project.provide('DATABASE_URL', container.getConnectionUri());
  return async () => {
    await container.stop();
  };
}

declare module 'vitest' {
  interface ProvidedContext {
    DATABASE_URL: string;
  }
}
```

Per test file, drop and recreate the schema, then migrate. `openTestDb` does that and hands back a Drizzle connection;
the persistence tests use it alone, without an application.

The examples are written for the stable `drizzle-orm` 0.x line. Read the installed version from `package.json`
first: from 1.0 (a release candidate at the time of writing) `drizzle()` takes `{ relations }` where 0.x takes
`{ schema }`, and the migrations folder holds one folder per migration instead of a `meta/_journal.json`. Open the
connection exactly as the project's `drizzle.provider.ts` does, whatever the version:

```ts
// test/utils/test-db.ts
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import pg from 'pg';
import type { DrizzleDb } from '../../src/database/drizzle.provider.js';
import * as schema from '../../src/database/schema.js';

export const MIGRATIONS = { migrationsFolder: './drizzle/migrations' }; // the `out` of drizzle.config.ts

export type TestDb = { db: DrizzleDb; close: () => Promise<void> };

export async function resetSchema(connectionString: string): Promise<void> {
  const client = new pg.Client({ connectionString });
  await client.connect();
  try {
    await client.query(
      'DROP SCHEMA IF EXISTS public CASCADE; DROP SCHEMA IF EXISTS drizzle CASCADE; CREATE SCHEMA public;',
    );
  } finally {
    await client.end();
  }
}

export async function openTestDb(connectionString: string): Promise<TestDb> {
  await resetSchema(connectionString);
  const pool = new pg.Pool({ connectionString });
  const db = drizzle(pool, { schema });
  await migrate(db, MIGRATIONS);
  return { db, close: () => pool.end() };
}
```

The service and API tests boot the application on the same reset and apply the test data:

```ts
// test/utils/create-app.ts
import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { inject } from 'vitest';
import { AppModule } from '../../src/app.module.js';
import { configureApp } from '../../src/configure-app.js';
import { DRIZZLE, type DrizzleDb } from '../../src/database/drizzle.provider.js';
import { applySeeds } from './apply-seeds.js';
import { MIGRATIONS, resetSchema } from './test-db.js';

export async function createTestApp({ seed = true } = {}): Promise<INestApplication> {
  const url = inject('DATABASE_URL');
  process.env.DATABASE_URL = url;
  await resetSchema(url);
  const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
  const app = moduleRef.createNestApplication();
  configureApp(app);
  await app.init();
  const db = app.get<DrizzleDb>(DRIZZLE);
  await migrate(db, MIGRATIONS);
  if (seed) {
    await applySeeds(db);
  }
  return app;
}
```

- **The application under test is the real one.** `Test.createTestingModule` builds only what the modules declare.
  What `main.ts` adds on top (`setGlobalPrefix`, `useGlobalPipes`, `useGlobalFilters`) is missing here: call the
  project's `configureApp(app)` from `/nest-rest` before `app.init()`, or repeat those lines in `createTestApp` and report it, because a test without the
  `ValidationPipe` passes against an application that does not exist. The prefix decides the paths the tests call.
- A project that migrates on boot needs no `migrate` call: the data follows `app.init()` either way.
- A connection read at import time needs `DATABASE_URL` earlier: set it in a `setupFiles` entry from `inject`.

This design has two constraints worth stating plainly, because otherwise they surface as intermittent failures:

- **One live application or `openTestDb` per test file.** The reset is global, so a second one while the first is alive
  wipes its data. Open in `beforeAll`, close in `afterAll`.
- **File parallelism stays off.** Two files running concurrently reset each other's schema mid-test.

A container per test file would avoid both and is the obvious-looking alternative; don't. Container startup dominates
the suite's runtime, and a dozen test files become minutes of waiting. Without a Docker daemon the suite cannot start:
say so in the report rather than claiming the tests pass.

## Test data

The test skills own the test data; the migration layer writes none. An existing test data convention of the project
always comes first. Without one, the rows a use case's preconditions and rejected flows need live in one file per use
case, the same file for every test skill of that use case; extend it when it exists:

```ts
// test/data/uc001-register-guest.ts
import type { DrizzleDb } from '../../src/database/drizzle.provider.js';
import { guests } from '../../src/database/schema.js';

export async function seed(db: DrizzleDb): Promise<void> {
  await db
    .insert(guests)
    .values({ firstName: 'Ada', lastName: 'Lovelace', email: 'ada@example.com', birthDate: '1990-01-15' })
    .onConflictDoNothing();
}
```

```ts
// test/utils/apply-seeds.ts
import { readdir } from 'node:fs/promises';
import type { DrizzleDb } from '../../src/database/drizzle.provider.js';

export async function applySeeds(db: DrizzleDb): Promise<void> {
  const folder = new URL('../data/', import.meta.url); // __dirname in a CommonJS project
  const files = (await readdir(folder)).filter((file) => /^uc.*\.[jt]s$/.test(file) && !file.endsWith('.d.ts'));
  for (const file of files.sort()) {
    const { seed } = await import(new URL(file, folder).href);
    await seed(db);
  }
}
```

- `test/data/uc<id>-<slug>.ts` exports `seed(db)` and is applied **after** `migrate()`. It is never a migration:
  Drizzle migrations are generated, and a hand-written one desynchronises the migration history.
- A seed is **idempotent** (`onConflictDoNothing` on a unique key) and leaves generated ids to the database, because
  every seed runs together and an E2E server may restart on the same database. Take the values from the specification's
  examples and the entity model.
- A test creates through the service or the API only the row whose creation it tests, never the fixture. Never inject
  a repository to arrange data, with one exception: a rule that needs a competing change (a stale version, a row
  inserted after the read), which the test arranges through the repository between the read and the write. A
  read-only check of a side effect the response does not expose is fine.
- **Cleanup:** remove only the rows the test created, in `afterEach`, by id or by the value the test used; never delete
  all data. A use case that offers no delete gets none added for a test: delete through the `DRIZZLE` handle of the
  application under test.
- **An external system** never answers a test. Where the Layers table has a client test skill, it writes the fake of
  each port. This plugin ships none: the test skill of the integration layer then writes the fake itself, a class in
  `test/fakes/<system>.fake.ts` that implements the port with the answers the alternative flows need, taken from the
  contract the `## External systems` table of the stack file names. `createTestApp` puts it in place of the adapter
  with `overrideProvider(<Port>).useValue(fake)` — the one override a test application gets — and the report names
  the file. The same fake serves the service and the API tests.
- **A flow the shared test data rules out** (an empty list) gets its own spec file, `UC-XXX-<slug>-empty.e2e-spec.ts`
  or `-empty.service-spec.ts`, whose `createTestApp({ seed: false })` starts without the rows. The tests run in process, so such a flow is reachable
  here; E2E leaves it to this layer.

## Non-deterministic inputs

Code that reads the clock or generates randomness inline (`new Date()`, `Math.random()`, `crypto.randomUUID()` in a
service method) cannot be asserted exactly. Pin it in the test rather than loosening the assertion to
`expect.any(String)`, which stops testing the thing that matters:

```ts
vi.useFakeTimers({ toFake: ['Date'] }); // only Date: fake timers would stall the database driver
vi.setSystemTime(new Date('2026-03-01T12:00:00.000Z'));
// …exercise the service…
vi.useRealTimers();
```

Where the project's own conventions call for an injectable clock and the code under test does not use one, **do not
refactor the source as part of writing tests.** Pin the value, get the test green, and report the inconsistency.
