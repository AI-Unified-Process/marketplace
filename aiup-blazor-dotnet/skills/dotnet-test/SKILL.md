---
name: dotnet-test
description: >
  Generates C# backend unit and integration tests for EF Core DbContext repositories,
  domain services, and vertical slice handlers using xUnit / NUnit.
  Use when the user asks to "write unit tests for C#", "test ef core context",
  "write integration tests for dotnet", or mentions xUnit backend tests.
---

# .NET Backend Unit & Integration Testing

## Goal

Generate unit and integration tests for non-UI C# code (EF Core `DbContext`, handlers, domain logic) using `xUnit` and in-memory or SQLite EF Core test contexts.

## Workflow

1. **Identify Target Service/Handler**:
   - Locate the target handler or EF Core repository (e.g. `PlaceOrderHandler.cs`).
2. **Setup Test Database Context**:
   - Use `DbContextOptionsBuilder` with `UseInMemoryDatabase` or `UseSqlite("DataSource=:memory:")`.
3. **Execute & Assert**:
   - Arrange test data into the `DbContext`.
   - Act: Call the handler/service method under test.
   - Assert: Verify expected outcome, exceptions, or database state.
4. **Verification**:
   - Execute `dotnet test` to confirm tests pass.
5. **Next Step Guidance**:
   - Conclude your response by guiding the user on E2E testing:
   > "Next step: Run `/playwright-test` to generate native C# end-to-end browser tests for your use cases."
