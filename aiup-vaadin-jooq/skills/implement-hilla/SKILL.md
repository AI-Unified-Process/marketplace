---
name: implement-hilla
description: >
  Implements use cases by creating Hilla views — React/TypeScript views with
  file-based routing calling @BrowserCallable Java services — and jOOQ queries
  for the data access layer. Use when the user asks to "implement with Hilla",
  "create a Hilla view", "build a React view for Vaadin", "create a
  @BrowserCallable endpoint", or mentions Hilla, client-side Vaadin views,
  file-based routing, TSX views, or React + jOOQ.
---

<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# Implement Use Case (Hilla)

## Instructions

Implement the use case $ARGUMENTS using Hilla (React) for the UI layer and jOOQ for data access.
Don't create tests – there are dedicated testing skills for that.

If the Vaadin and jOOQ MCP servers are configured, check them for guidance; otherwise rely on your own knowledge and the documentation links below.

## If an Implementation Already Exists

A diff of the specification change may follow the file path in the arguments. When it is there, it
is the definitive list of what changed — work through it change by change. A removed line is an
instruction to delete the behaviour it described: the remaining specification is already satisfied
by the existing code, so a removal is invisible unless you compare code to spec in both directions.

Before writing any code, check whether this use case is already implemented — search for the view,
service, repository, and DTO names the spec implies, and for existing `UC-XXX` references. If an
implementation exists, **reconcile it with the specification instead of building a parallel one**:

- Read the existing code end to end and compare it against the current spec
- Change only what the spec now requires — added or renamed fields, changed validation rules,
  new alternative flows, different labels or messages
- Edit the existing files in place; never create a second view, service, repository, or DTO for
  the same use case
- Remove code the spec no longer calls for (dropped fields, removed flows, obsolete queries)
- Leave everything the spec does not touch alone — no incidental refactoring, renaming, or
  restyling
- Check what the class-level comments attribute to this use case: behaviour they describe that
  the spec no longer mentions is dropped behaviour to remove, not decoration to keep
- Report at the end which files changed and which spec change drove each one

## DO NOT

- Create test classes (use dedicated testing skills instead)
- Use `fetchInto(SomeDto.class)` for projected queries — use `Records.mapping(SomeDto::new)` instead
- Hand-write TypeScript clients or REST controllers — Hilla generates the TypeScript client from
  the `@BrowserCallable` class

## Workflow

1. Read the use case specification from `docs/use_cases/`
2. Read the entity model from `docs/entity_model.md`
3. Check existing code for patterns and conventions, and determine whether the use case is
   already implemented — if so, follow "If an Implementation Already Exists" above and update
   those files rather than creating new ones
4. Implement the data access layer using jOOQ
5. Verify the data access layer compiles and follows existing patterns
6. Implement a `@BrowserCallable` service that delegates to the data access layer and returns DTOs
7. Implement the React view as a `.tsx` file under `src/main/frontend/views/`, calling the
   generated TypeScript client of the service
8. Verify the full implementation compiles successfully (Java and frontend)

## Hilla specifics

- **Browser-callable service** — annotate a Spring service with
  `com.vaadin.hilla.BrowserCallable`; secure it with `@AnonymousAllowed`, `@PermitAll`, or
  `@RolesAllowed` following the conventions of the existing services. Hilla generates a
  type-safe TypeScript client for it — call that client from the view, never `fetch` directly.
- **File-based routing** — the view's route derives from its location under
  `src/main/frontend/views/` (`views/persons.tsx` → `/persons`). Export a `ViewConfig`
  (`export const config: ViewConfig = { ... }`) for the title and menu entry when the
  existing views do.
- **Components** — build the view with the Vaadin React components (`@vaadin/react-components`):
  `Grid` with `GridColumn` for listings, field components inside forms.
- **Forms** — use `useForm` from `@vaadin/hilla-react-form` with the generated model class
  (e.g. `PersonDtoModel`) so validation rules flow from the Java annotations into the browser.
- **Nullability** — annotate DTO fields with `@NonNull` or Jakarta validation annotations such as
  `@NotNull`/`@NotBlank` where the entity model requires a value, so the generated TypeScript
  types are non-optional and forms validate consistently on both sides.

## jOOQ result mapping

When a query projects columns into a DTO, Java `record`, or any immutable class,
map the result with `org.jooq.Records.mapping(...)` and a constructor reference.
Do **not** use `fetchInto(Dto.class)` — it uses reflection and is not checked
against the projection at compile time.

```java
import org.jooq.Records;

// List
List<PersonDto> persons = ctx
    .select(PERSON.ID, PERSON.FIRST_NAME, PERSON.LAST_NAME, PERSON.EMAIL)
    .from(PERSON)
    .fetch(Records.mapping(PersonDto::new));

// Single (optional) row
Optional<PersonDto> person = ctx
    .select(PERSON.ID, PERSON.FIRST_NAME, PERSON.LAST_NAME, PERSON.EMAIL)
    .from(PERSON)
    .where(PERSON.ID.eq(id))
    .fetchOptional(Records.mapping(PersonDto::new));

// Stream
try (Stream<PersonDto> stream = ctx
        .select(PERSON.ID, PERSON.FIRST_NAME, PERSON.LAST_NAME, PERSON.EMAIL)
        .from(PERSON)
        .fetchStream()
        .map(Records.mapping(PersonDto::new))) {
    ...
}
```

The order of the projected columns must match the constructor parameter order
of the target type — the compiler will enforce this.

Exception: when fetching a generated table record without projection
(`ctx.selectFrom(PERSON).fetchInto(Person.class)` using the generator-produced
POJO), the generated `into` mapper is fine.

## Resources

- If configured, use the Vaadin MCP server for component documentation, including the React
  component APIs (`https://mcp.vaadin.com/docs`)
- If configured, use the jOOQ MCP server for query DSL reference (`https://jooq-mcp.martinelli.ch/mcp`)
- If configured, use the JavaDocs MCP server for API documentation (`https://www.javadocs.dev/mcp`)
- See [the MCP setup rule](../../rules/mcp-servers.md) to configure these optional servers
