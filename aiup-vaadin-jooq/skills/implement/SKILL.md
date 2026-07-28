---
name: implement
description: >
  Implements use cases by creating Vaadin views, forms, and grids for the UI
  layer and jOOQ queries for the data access layer. Use when the user asks to
  "implement a use case", "build the UI", "create a Vaadin view", "write the
  data access layer", or mentions Vaadin implementation, jOOQ queries,
  Java web app, or database-backed UI.
---

# Implement Use Case

## Instructions

Implement the use case $ARGUMENTS using Vaadin for the UI layer and jOOQ for data access.
Don't create tests – there are the `karibu-test` and `playwright-test` skills for that.

If the Vaadin and jOOQ MCP servers are configured, check them for guidance; otherwise rely on your own knowledge and the documentation links below.

## If an Implementation Already Exists

A diff of the specification change may follow the file path in the arguments. When it is there, it
is the definitive list of what changed — work through it change by change. A removed line is an
instruction to delete the behaviour it described: the remaining specification is already satisfied
by the existing code, so a removal is invisible unless you compare code to spec in both directions.

Before writing any code, check whether this use case is already implemented — search for the view,
repository, and DTO names the spec implies, and for existing `UC-XXX` references. If an
implementation exists, **reconcile it with the specification instead of building a parallel one**:

- Read the existing code end to end and compare it against the current spec
- Change only what the spec now requires — added or renamed fields, changed validation rules,
  new alternative flows, different labels or messages
- Edit the existing files in place; never create a second view, repository, or DTO for the same
  use case
- Remove code the spec no longer calls for (dropped fields, removed flows, obsolete queries)
- Leave everything the spec does not touch alone — no incidental refactoring, renaming, or
  restyling
- Check what the class-level comments attribute to this use case: behaviour they describe that
  the spec no longer mentions is dropped behaviour to remove, not decoration to keep
- Report at the end which files changed and which spec change drove each one

## DO NOT

- Create test classes (use dedicated testing skills instead)
- Use `fetchInto(SomeDto.class)` for projected queries — use `Records.mapping(SomeDto::new)` instead

## Workflow

1. Read the use case specification from `docs/use_cases/`
2. Read the entity model from `docs/entity_model.md`
3. Check existing code for patterns and conventions, and determine whether the use case is
   already implemented — if so, follow "If an Implementation Already Exists" above and update
   those files rather than creating new ones
4. Implement the data access layer using jOOQ
5. Verify the data access layer compiles and follows existing patterns
6. Implement the Vaadin view following existing patterns
7. Wire up the view with the data access layer
8. Verify the full implementation compiles successfully

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

- If configured, use the Vaadin MCP server for component documentation (`https://mcp.vaadin.com/docs`)
- If configured, use the jOOQ MCP server for query DSL reference (`https://jooq-mcp.martinelli.ch/mcp`)
- If configured, use the JavaDocs MCP server for API documentation (`https://www.javadocs.dev/mcp`)
- See [the MCP setup rule](../../rules/mcp-servers.md) to configure these optional servers
