<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# The running application for E2E: a NestJS API on Drizzle

Read this only when the backend is a NestJS API on Drizzle and the project has no way yet of starting it for the
browser tests. An existing entry point of the project comes first.

Browser tests run against a started application that must load the same test data as the backend tests. The backend
test skills write that data as one seed per use case, `test/data/uc<id>-<slug>.ts`, each exporting `seed(db)`, and the
helper `test/utils/apply-seeds.ts` that runs them all after the migrations. Reuse both. When the project has no such
helper, apply the seeds the same way in the entry point: import every `test/data/uc*.ts` file in name order and call
its `seed(db)`. Never write a seed here: the test data belongs to the backend test skills.

`src/` never imports `test/`, so a small entry point starts the application, migrates, seeds, and then listens:

```ts
// test/e2e-server.ts
import { NestFactory } from '@nestjs/core';
import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { AppModule } from '../src/app.module.js';
import { configureApp } from '../src/configure-app.js';
import { DRIZZLE, type DrizzleDb } from '../src/database/drizzle.provider.js';
import { applySeeds } from './utils/apply-seeds.js';

// The server owns its database: a throwaway container, unless DATABASE_URL names one.
process.env.DATABASE_URL ??= (await new PostgreSqlContainer('postgres:17-alpine').start()).getConnectionUri();

const app = await NestFactory.create(AppModule);
configureApp(app);
const db = app.get<DrizzleDb>(DRIZZLE);
await migrate(db, { migrationsFolder: './drizzle/migrations' });
await applySeeds(db);
await app.listen(process.env.PORT ?? 3001);
```

`configureApp` is the function the API layer calls in `main.ts` (global prefix, pipes, filters), so the E2E server
configures the same application. When the project has none, copy what `main.ts` configures and say so in the report.
Examples show a NodeNext project; drop the `.js` suffixes where the project has none.

```jsonc
// tsconfig.e2e.json
{
  "extends": "./tsconfig.json",
  "compilerOptions": { "rootDir": ".", "outDir": "dist-e2e" },
  "include": ["src/**/*", "test/e2e-server.ts", "test/data/**/*", "test/utils/apply-seeds.ts"]
}
```

Compile it with `tsc -p tsconfig.e2e.json` and start `node dist-e2e/test/e2e-server.js` from the API app's root, because
the migrations folder is relative. Testcontainers removes the container when the process ends, so each start begins
with a clean database. Do not run it with `tsx`: esbuild emits no decorator metadata, so dependency injection fails. A
test skill never edits the Commands table of `docs/architecture/stack.md`: name the two commands in the report, for the
team to record under End-to-end tests. Add `dist-e2e` to `.gitignore`. The top-level `await` needs ESM; in a CommonJS
project wrap the body in an async function.
