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

## If an Implementation Already Exists

A diff of the specification change may follow the file path in the arguments. When it is there, it
is the definitive list of what changed — work through it change by change. A removed line is an
instruction to delete the behaviour it described: the remaining specification is already satisfied
by the existing code, so a removal is invisible unless you compare code to spec in both directions.

Before writing any code, check whether this use case is already implemented — look for a
`Features/UCXXX_<FeatureName>/` folder, and search for the page, command/query, handler, and entity
names the spec implies. If an implementation exists, **reconcile it with the specification instead
of building a parallel one**:

- Read the existing slice end to end and compare it against the current spec
- Change only what the spec now requires — added or renamed fields, changed validation rules,
  new alternative flows, different labels or messages
- Edit the existing files in place; never create a second feature folder, page, handler, or
  command/query for the same use case
- Propagate a changed field through the whole slice (entity → EF configuration → command/query →
  handler → validator → ViewModel → `.razor` markup)
- Remove code the spec no longer calls for, and add a new EF Core migration for schema changes —
  never edit a migration that has already been applied
- Leave everything the spec does not touch alone — no incidental refactoring, renaming, or
  restyling
- Check what the class-level comments attribute to this use case: behaviour they describe that
  the spec no longer mentions is dropped behaviour to remove, not decoration to keep
- Report at the end which files changed and which spec change drove each one

## Workflow & Conventions

1. **Read Specifications & Design Requirements**:
   - Read the use case specification `docs/use_cases/UC-XXX-*.md`.
   - Read `docs/requirements.md` to extract relevant Non-Functional Requirements (NFRs), UI/UX design constraints (`C-XXX`), styling/theme directives, color palettes, and accessibility requirements.
   - Read the entity model `docs/entity_model.md`.
   - Read `docs/vision.md` if additional visual identity or brand guidelines are needed.
   - Check whether the use case is already implemented. If it is, follow "If an Implementation Already Exists" above and update the existing slice instead of creating new files.

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
   - Use `@rendermode InteractiveServer` or `@rendermode InteractiveAuto` for interactive Blazor components as required by project conventions, or Static SSR (`@attribute [StreamRendering]`) for read-heavy pages.
   - Inject dependencies via standard ASP.NET Core DI (`[Inject]` or `@inject`).
   - **DbContext Scoping in Blazor**: In Blazor Interactive Server, components are circuit-scoped. Use `IDbContextFactory<AppDbContext>` or delegate data access to transient/scoped MediatR or command handlers to prevent `DbContext` concurrency exceptions.
   - Pass `CancellationToken` from Blazor component events and lifecycle methods to async handlers.
   - Map domain entities to ViewModels/DTOs before presenting to UI.

4. **UI Design & Styling Standards**:
   - **Rich Modern Aesthetics**: Implement polished, modern web design matching the styling/NFR guidelines in `docs/requirements.md`. Avoid raw unstyled HTML elements.
   - **Scoped & Global CSS**: Put component-specific styles in `UCXXX_Page.razor.css` or integrate with global CSS design tokens (`wwwroot/app.css`).
   - **Typography & Color Palettes**: Use curated harmonious color palettes, modern typography, card/container elevation, subtle shadows, and clear visual hierarchy.
   - **Interactive States & Feedback**: Include hover effects, active states, loading spinners, empty states, and validation error highlights.
   - **Responsive & Accessible**: Build flex/grid responsive layouts with ARIA accessibility tags.

5. **DO NOT**:
   - Place business logic directly inside `.razor` markup files — delegate to handlers or code-behind `.razor.cs`.
   - Inject a raw scoped `DbContext` directly into interactive Blazor components — use `IDbContextFactory` or handler abstraction instead.
   - Put raw SQL string concatenation into queries — use EF Core LINQ.
   - Create test files directly (use `bunit-test` and `dotnet-test` skills).

6. **Template Boilerplate Cleanup & Navigation**:
   - **Remove Default Sample Pages**: Remove default `dotnet new blazor` boilerplate sample pages (`Counter.razor`, `Weather.razor`) and their links from `NavMenu.razor` when implementing initial features.
   - **Update Layout Navigation**: Register the new use case page route in `Components/Layout/NavMenu.razor` (or project navigation layout) using styled `NavLink` elements matching the app theme.

7. **Compilation Verification**:
   - Run `dotnet build` to verify clean compilation.

8. **Next Step Guidance**:
   - Conclude your response by summarizing the implemented feature files and guiding the user to the testing phase:
   > "Next step: Run `/bunit-test` to write component UI tests, or `/dotnet-test` to write backend integration tests, followed by `/playwright-test` to generate end-to-end browser tests."
