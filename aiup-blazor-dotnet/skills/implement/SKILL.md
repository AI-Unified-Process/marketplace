---
name: implement
description: >
  Implements use cases for C# and Blazor (.NET 10) applications using a Vertical
  Slice Architecture. Takes a UC-XXX.md specification and generates feature-folder
  components, C# Commands/Queries, EF Core entities/configurations, and Blazor
  pages/components. Use when the user asks to "implement a use case in C#",
  "build a Blazor page", "create a Vertical Slice", or mentions Blazor, .NET 10,
  or C# implementation.
---

# Implement Use Case (C# / Blazor .NET 10)

## Goal

Implement the specified use case (`UC-XXX.md`) in a C# and Blazor application following Vertical Slice Architecture principles.

## Workflow & Conventions

1. **Read Specifications**:
   - Read the use case specification `docs/use_cases/UC-XXX-*.md`.
   - Read the entity model `docs/entity_model.md`.

2. **Vertical Slice Folder Structure**:
   - Organize code into feature folders: `Features/UCXXX_<FeatureName>/`.
   - Example contents:
     - `UCXXX_Page.razor` & `UCXXX_Page.razor.cs` (Blazor UI component)
     - `UCXXX_Command.cs` or `UCXXX_Query.cs` (Request payload)
     - `UCXXX_Handler.cs` (Use case execution logic / EF Core operations)
     - `UCXXX_Validator.cs` (Validation rules using FluentValidation or Data Annotations)

3. **C# & Blazor Guidelines (.NET 10)**:
   - Use file-scoped namespaces (`namespace MyApp.Features.UC001;`).
   - Use modern C# features (primary constructors, `required` properties, pattern matching, collection expressions `[]`).
   - Use `@rendermode InteractiveServer` or `@rendermode InteractiveAuto` for interactive Blazor components as required by project conventions.
   - Inject dependencies via standard ASP.NET Core DI (`[Inject]` or `@inject`).
   - Map domain entities to ViewModels/DTOs before presenting to UI.

4. **DO NOT**:
   - Place business logic directly inside `.razor` markup files — delegate to handlers or code-behind `.razor.cs`.
   - Put raw SQL string concatenation into queries — use EF Core LINQ.
   - Create test files directly (use `bunit-test` and `dotnet-test` skills).

5. **Compilation Verification**:
   - Run `dotnet build` to verify clean compilation.
