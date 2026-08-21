---
name: playwright-test
description: >
  Generates native C# Playwright end-to-end (E2E) browser tests for user journeys
  (UC-* / TC-*) using Microsoft.Playwright.Xunit.
  Use when the user asks to "write e2e test", "create playwright test for dotnet",
  "write browser test in C#", or mentions Playwright with .NET.
---

<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# Native C# Playwright E2E Testing

## Goal

Write end-to-end browser tests in native C# using `Microsoft.Playwright.Xunit` inside a dedicated E2E test project (`*.Tests.E2E`).

## If Tests for This Use Case / Test Case Already Exist

A diff of the specification change may follow the file path in the arguments. When it is there, it
is the definitive list of what changed — work through it change by change. A removed line means the
scenario it described was dropped: delete the tests that exist only for it instead of keeping them
as passing extras.

Before writing new tests, look in the `*.Tests.E2E` project for an existing test class covering this
use case or test case (e.g. `PlaceOrderE2ETest.cs`, or any class referencing the UC-XXX / TC-XXX ID).
If one exists, **update it to match the current specification instead of creating a second class**:

- Add tests for scenarios, alternative flows, or Flow rows the spec has gained since the tests were
  written
- Update existing tests whose expected text, labels, routes, or step order the spec has changed
- Delete tests for scenarios or Flow rows the spec no longer contains
- Leave passing tests the spec still requires untouched
- Update seeded test data and cleanup when the spec's Preconditions or Postconditions changed
- Run the whole test class afterwards, not only the tests you added

## Workflow

1. **Read Use Case / Test Case Specs**:
   - Read `docs/use_cases/UC-XXX-*.md` or `docs/test_cases/TC-XXX-*.md`.
   - Check whether E2E tests for this artifact already exist. If they do, follow "If Tests for This Use Case / Test Case Already Exist" above and update them instead of adding a parallel class.
2. **Setup Playwright Test Class & Host Server**:
   - Inherit from `Microsoft.Playwright.Xunit.PageTest`.
   - Configure a web application test server fixture (`WebApplicationFactory<Program>` or custom host fixture) to launch the app automatically on a dynamic port during test execution, or read base URL from configuration (`https://localhost:5001`).
3. **Implement E2E User Journeys**:
   - Use web-first locators (`GetByRole`, `GetByLabel`, `GetByTestId`) and async assertions (`Expect(...).ToBeVisibleAsync()`).
   - Allow Blazor interactive hydration to complete after navigation before interacting with components.
   ```csharp
   namespace MyApp.Tests.E2E;

   public class PlaceOrderE2ETest : PageTest
   {
       private readonly string _baseUrl;

       public PlaceOrderE2ETest(TestServerFixture fixture)
       {
           _baseUrl = fixture.BaseUrl; // Dynamic test host URL or configuration
       }

       [Fact]
       public async Task UserCanPlaceOrderSuccessfully()
       {
           await Page.GotoAsync($"{_baseUrl}/place-order");
           await Page.GetByLabel("Quantity").FillAsync("2");
           await Page.GetByRole(AriaRole.Button, new() { Name = "Submit Order" }).ClickAsync();
           await Expect(Page.GetByText("Order Placed Successfully")).ToBeVisibleAsync();
       }
   }
   ```
4. **Verification**:
   - Run `dotnet test` to execute end-to-end tests against the application.
