---
name: implement-vaadin-jooq
description: >
  Stack-specific implementation skill for projects using Vaadin (UI) and jOOQ
  (data access). Creates Vaadin views, forms, and grids and writes jOOQ queries
  for the data access layer. Invoked by the aiup-core /implement dispatcher
  when it detects Vaadin and jOOQ on the classpath; can also be invoked
  directly via /implement-vaadin-jooq for projects that want to bypass
  detection.
---

# Implement Use Case (Vaadin + jOOQ)

## Instructions

Implement the use case $ARGUMENTS using Vaadin for the UI layer and jOOQ for data access.
Don't create tests – there are dedicated `/browserless-test`, `/karibu-test`, and `/playwright-test` skills for that
(or invoke the `/test` dispatcher to pick the right one automatically).

Check the Vaadin and jOOQ MCP servers for guidance.

## DO NOT

- Create test classes (use the dedicated testing skills instead)

## Workflow

1. Read the use case specification from `docs/use_cases/`
2. Read the entity model from `docs/entity_model.md`
3. Check existing code for patterns and conventions
4. Implement the data access layer using jOOQ
5. Verify the data access layer compiles and follows existing patterns
6. Implement the Vaadin view following existing patterns
7. Wire up the view with the data access layer
8. Verify the full implementation compiles successfully

## Resources

- Use the Vaadin MCP server for component documentation
- Use the jOOQ MCP server for query DSL reference
- Use the JavaDocs MCP server for API documentation
