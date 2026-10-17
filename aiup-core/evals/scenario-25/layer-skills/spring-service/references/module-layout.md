<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# Backend module layout

This is a lookup used by the Spring Boot layer skills (`/spring-service`, `/spring-rest`, `/spring-service-test`,
`/spring-rest-test`) and by `/jpa-persistence` before writing any code. It is the only copy; the other skills
locate it by a glob for `**/*spring-service/references/module-layout.md`. Its job is to answer one question: **does this Spring Boot backend
split hexagonal layers across separate Maven or Gradle modules, or is it one flat module?** Generating flat-style
code into a hexagonal reactor (or the other way round) breaks the project's module dependency direction — for
example a JPA `@Entity` or a jOOQ record placed in a `domain` module that has no framework dependencies.

## Step 0 — Read docs/architecture/development.md

The `## Module layout` section of `docs/architecture/development.md` records the layout, the root package, and where each
layer's code and tests live. When it does, follow it and skip to Step 4. Run Steps 1–3 only when the section is
empty or contradicts the build files — and then say so in the report and hand off to `/architecture`, which records
the layout; never edit `docs/architecture/development.md` beyond the Markers table yourself.

## Step 1 — Find the real reactor

Read the backend's root `pom.xml` (or `settings.gradle(.kts)`). If it is a thin aggregator —
`<packaging>pom</packaging>`, a `<modules>` list pointing at sibling directories, no Java source of its own (common
when a repository's outermost build aggregates both a frontend module and a backend directory) — descend into
whichever listed module itself declares further modules, and treat *that* module list as the candidate reactor.
Don't stop at the outermost aggregator if it is just a wrapper.

## Step 2 — Classify each module by keyword bucket

Strip any common project-name prefix from each module's directory name / `artifactId`, split the rest into tokens
on `-`, `_`, and `.`, and match the tokens case-insensitively against these buckets. A token must equal a keyword —
a substring is not enough, so `main` does not match `domain`, `app` not `application`, `ui` not `build` — except
`infra*`, which matches any token starting with `infra`:

| Bucket               | Keywords                                                          |
|----------------------|-------------------------------------------------------------------|
| Domain               | `domain`                                                          |
| Business/Application | `business`, `application`, `service`, `core`                      |
| Persistence adapter  | `postgres`, `jpa`, `jooq`, `persistence`, `db`, `infra*`, `data`  |
| Inbound adapter      | `api`, `web`, `rest`, `controller`, `ui`                          |
| Composition root     | `app`, `bootstrap`, `launcher`, `main`, `runner`                  |

When a module matches several buckets, a Domain or Business/Application match wins over Composition root
(`hotel-app-core` is Business/Application, not the composition root).

## Step 3 — Confidence gate

Classify as **Hexagonal Multi-Module** only if a Domain-bucket module is present **and** at least two of
{Business/Application, Persistence adapter, Inbound adapter} are also present. Never switch pattern on a single
keyword match alone.

Otherwise → **Flat Single-Module**. Say so explicitly ("found N modules but couldn't confidently classify them as a
layered split — implementing as a flat pattern into `<module>`") rather than silently picking one.

## Step 4 — Imitate an existing feature (hexagonal case)

Find one already-implemented feature across the modules and copy its exact shape — don't generate purely from this
heuristic in isolation:

- **Outbound port location**: is the repository/port interface a plain sibling file next to the service class, or
  does it live in a dedicated `port`/`port.out` subpackage? Match whichever exists.
- **Inbound port**: does any use-case/inbound-port interface exist anywhere in the reactor (something the controller
  or view calls instead of a concrete service)? If none exists project-wide, do **not** invent one — the inbound
  adapter calls the concrete `@Service` class directly, matching the existing asymmetric convention.
- **DTO conversion**: is it a static factory method on the DTO record itself (e.g. `XxxDto.from(domainObject)`), or
  a separate mapper class? Match whichever exists. Request side and response side may use different approaches —
  copy each side's own convention rather than unifying them.

## Step 5 — First hexagonal use case (nothing to imitate yet)

If the reactor is Hexagonal Multi-Module but has no existing feature to copy, use this default rather than inventing
textbook full hexagonal:

- Outbound port as a plain sibling interface in the business module (not a `port` subpackage).
- No inbound port/use-case interface — the inbound adapter calls the concrete service directly.
- Domain-to-response conversion via a static factory method on the response DTO record.

## Reference chain (hexagonal case)

```
<Feature>Controller / view              (inbound adapter module)
  → <Feature>Service                    (business module, concrete class — no interface)
    → <Feature>Repository (interface)   (business module — the outbound port)
      → <Feature>RepositoryImpl         (persistence adapter module, implements the port)
        → JPA entity + JpaRepository, or jOOQ DSLContext queries
  → <Feature>Response.from(...)         (inbound adapter or business module — domain → response DTO)
```

The domain module holds plain records and value types only. Never let a JPA, jOOQ, Spring, or web import leak into
it — that module's whole purpose is to have zero framework dependencies.

## Build verification order (hexagonal case)

Compile `domain` first, then `business`, then the persistence and inbound adapters (either order, they don't depend
on each other), then the composition root — following the reactor's own dependency graph rather than building
everything at once and debugging a wall of cross-module errors.

## Where tests live (hexagonal case)

- Service tests with test doubles for the port need only the business module: they live there.
- Tests that need the real persistence adapter, a database, or the web layer — `@SpringBootTest`, MockMvc, a live
  server — go in the **composition-root module**, the only module with every layer on the classpath.
- Persistence-only tests (`@DataJpaTest`, `@JooqTest`) live in the persistence adapter module.
