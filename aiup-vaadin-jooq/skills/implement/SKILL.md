---
name: implement
description: Implements use cases using Vaadin for the UI and jOOQ for data access.
---

# Implement Use Case

## Instructions

Implement the use case $ARGUMENTS using Vaadin for the UI layer and jOOQ for data access.
Don't create tests – there are the `karibu-test` and `playwright-test` skills for that.

Check the Vaadin and jOOQ MCP servers for guidance.

## DO NOT

- Create test classes (use dedicated testing skills instead)

## Workflow

1. Read the use case specification from `docs/use_cases/`
2. Read the entity model from `docs/entity_model.md`
3. Check existing code for patterns and conventions
4. Implement the data access layer using jOOQ
5. Implement the Vaadin view following existing patterns
6. Wire up the view with the data access layer
7. Verify the implementation compiles

## Resources

- Use the Vaadin MCP server for component documentation
- Use the jOOQ MCP server for query DSL reference
- Use the JavaDocs MCP server for API documentation
