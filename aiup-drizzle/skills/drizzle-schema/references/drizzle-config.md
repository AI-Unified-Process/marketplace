<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# Locating the Drizzle configuration

A lookup used by `/drizzle-schema`, `/drizzle-persistence`, and `/drizzle-persistence-test` before they touch the
schema. Read `drizzle.config.ts` in the root of the API app. Two fields matter:

| Field    | Meaning                                       | Common value           |
|----------|-----------------------------------------------|------------------------|
| `schema` | The file or directory to edit                 | `./src/database/schema.ts` |
| `out`    | The directory generated migrations land in    | `./drizzle/migrations` |

Never infer either from convention. A project that keeps its schema split across several files under a `schema/`
directory is normal, and writing into a `schema.ts` the config does not point at produces a table that never reaches
the database. With a split schema, add a table to the file of its aggregate, or follow what the existing files do.

`out` holds the numbered `.sql` files and `meta/`, with `_journal.json` and one snapshot per migration. All of them
are generated.

## Drizzle version

Read the installed `drizzle-orm` and `drizzle-kit` versions from `package.json` (and the lock file) before anything
else. The Drizzle skills describe the stable line, `drizzle-orm` 0.x with `drizzle-kit` 0.3x; 1.0 was a release
candidate when this was written. Never upgrade across the major as a side effect, and follow the installed one:

| Topic               | `drizzle-orm` 0.x, `drizzle-kit` 0.3x (described here)         | From 1.0                                                           |
|---------------------|-----------------------------------------------------------------|--------------------------------------------------------------------|
| Migrations in `out` | numbered `.sql` files, `meta/_journal.json`, `meta/*_snapshot.json` | one folder per migration with `migration.sql` and `snapshot.json`; no journal (`drizzle-kit up` converts an old folder — the team's decision, never a side effect) |
| Relational queries  | `relations()` per table, `drizzle(pool, { schema })`            | `defineRelations(...)`, `drizzle(pool, { relations })`             |
| `db.query` filters  | callback `where: (t, { eq }) => …`                              | object `where: { … }`                                              |

On a 1.x project, read "journal" in these skills as the migration folders, check a claim against the Drizzle
documentation before relying on it, and say in the report which version the project is on. The rules do not change:
the schema is the source of truth, migrations are generated and never hand-edited, and the repository owns the
transaction.

## No `drizzle.config.ts` yet

"Never infer" is about a project that has a configuration. A new project has none: create it in the root of the API
app with the common values above, and add what the layer needs. The Drizzle row of the stack file is the decision for
these dependencies; name them in the report.

```ts
// drizzle.config.ts
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/database/schema.ts',
  out: './drizzle/migrations',
  dbCredentials: { url: process.env.DATABASE_URL ?? '' },
});
```

```bash
npm install drizzle-orm pg
npm install -D drizzle-kit @types/pg
```

## The database handle

Also read how the application gets its database handle, usually a provider such as `src/database/drizzle.provider.ts`
with an injection token (`DRIZZLE`) and a `DrizzleDb` type. Repositories and tests use that provider; they never open
a second connection. Whether it passes the schema (0.x) or the relations (from 1.0) to `drizzle(...)` decides whether
relational queries (`db.query.<table>`) are available. A project without one gets it from `/drizzle-persistence`, section "The Database
Provider".
