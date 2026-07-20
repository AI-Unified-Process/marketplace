---
name: playwright-test
description: >
  Generates native C# Playwright end-to-end (E2E) browser tests for user journeys
  (UC-* / TC-*) using Microsoft.Playwright.Xunit.
  Use when the user asks to "write e2e test", "create playwright test for dotnet",
  "write browser test in C#", or mentions Playwright with .NET.
---

# Native C# Playwright E2E Testing

## Goal

Write end-to-end browser tests in native C# using `Microsoft.Playwright.Xunit` inside a dedicated E2E test project (`*.Tests.E2E`).

## Workflow

1. **Read Use Case / Test Case Specs**:
   - Read `docs/use_cases/UC-XXX-*.md` or `docs/test_cases/TC-XXX-*.md`.
2. **Setup Playwright Test Class**:
   - Inherit from `Microsoft.Playwright.Xunit.PageTest`.
   - Use `[Fact]` or `[Theory]` attributes.
3. **Implement E2E User Journeys**:
   ```csharp
   namespace MyApp.Tests.E2E;

   public class PlaceOrderE2ETest : PageTest
   {
       [Fact]
       public async Task UserCanPlaceOrderSuccessfully()
       {
           await Page.GotoAsync("https://localhost:5001/place-order");
           await Page.GetByLabel("Quantity").FillAsync("2");
           await Page.GetByRole(AriaRole.Button, new() { Name = "Submit Order" }).ClickAsync();
           await Expect(Page.GetByText("Order Placed Successfully")).ToBeVisibleAsync();
       }
   }
   ```
4. **Verification**:
   - Run `dotnet test` to execute end-to-end tests against the running application.
