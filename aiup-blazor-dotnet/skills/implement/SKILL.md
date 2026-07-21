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

1. **Read Specifications & Design Requirements**:
   - Read the use case specification `docs/use_cases/UC-XXX-*.md`.
   - Read `docs/requirements.md` to extract relevant Non-Functional Requirements (NFRs), UI/UX design constraints (`C-XXX`), styling/theme directives, color palettes, and accessibility requirements.
   - Read the entity model `docs/entity_model.md`.
   - Read `docs/vision.md` if additional visual identity or brand guidelines are needed.

2. **Vertical Slice Folder Structure**:
   - Organize code into feature folders: `Features/UCXXX_<FeatureName>/`.
   - Example contents:
     - `UCXXX_Page.razor` (Blazor UI component template)
     - `UCXXX_Page.razor.cs` (Code-behind logic)
     - `UCXXX_Page.razor.css` (Scoped CSS styles for rich UI aesthetics)
     - `UCXXX_Command.cs` or `UCXXX_Query.cs` (Request payload)
     - `UCXXX_Handler.cs` (Use case execution logic / EF Core operations)
     - `UCXXX_Validator.cs` (Validation rules using FluentValidation or Data Annotations)

3. **C# & Blazor Guidelines (.NET 10)**:
   - Use file-scoped namespaces (`namespace MyApp.Features.UC001;`).
   - Use modern C# features (primary constructors, `required` properties, pattern matching, collection expressions `[]`).
   - Use `@rendermode InteractiveServer` or `@rendermode InteractiveAuto` for interactive Blazor components as required by project conventions.
   - Inject dependencies via standard ASP.NET Core DI (`[Inject]` or `@inject`).
   - Map domain entities to ViewModels/DTOs before presenting to UI.

4. **UI Design & Styling Standards**:
   - **Rich Modern Aesthetics**: Implement polished, modern web design matching the styling/NFR guidelines in `docs/requirements.md`. Avoid raw unstyled HTML elements.
   - **Scoped & Global CSS**: Put component-specific styles in `UCXXX_Page.razor.css` or integrate with global CSS design tokens (`wwwroot/app.css`).
   - **Typography & Color Palettes**: Use curated harmonious color palettes, modern typography, card/container elevation, subtle shadows, and clear visual hierarchy.
   - **Interactive States & Feedback**: Include hover effects, active states, loading spinners, empty states, and validation error highlights.
   - **Responsive & Accessible**: Build flex/grid responsive layouts with ARIA accessibility tags.

4. **DO NOT**:
   - Place business logic directly inside `.razor` markup files — delegate to handlers or code-behind `.razor.cs`.
   - Put raw SQL string concatenation into queries — use EF Core LINQ.
   - Create test files directly (use `bunit-test` and `dotnet-test` skills).

5. **Compilation Verification**:
   - Run `dotnet build` to verify clean compilation.

6. **Next Step Guidance**:
   - Conclude your response by summarizing the implemented feature files and guiding the user to the testing phase:
   > "Next step: Run `/bunit-test` to write component UI tests, or `/dotnet-test` to write backend integration tests, followed by `/playwright-test` to generate end-to-end browser tests."
