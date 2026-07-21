---
name: bunit-test
description: >
  Generates bUnit component unit and integration tests for Blazor components (.razor).
  Use when the user asks to "write bUnit tests", "test Blazor component", "create UI test for Blazor",
  or mentions bUnit, Blazor component testing, or xUnit rendering tests.
---

# bUnit Component Testing

## Goal

Generate unit and integration tests for Blazor `.razor` UI components using the `bUnit` testing library and `xUnit`.

## Workflow

1. **Locate Target Component**:
   - Identify the Blazor component under test (e.g. `Features/UC001_PlaceOrder/PlaceOrderPage.razor`).
2. **Setup bUnit Test Class**:
   - Inherit from `TestContext` (or use `bUnit` test fixture).
   - Register mock services using `Services.AddSingleton` or `Services.AddScoped`.
3. **Render & Test Component**:
   - Render component: `var cut = RenderComponent<PlaceOrderPage>();`
   - Interact with elements: `cut.Find("button#submit").Click();`
   - Assert DOM changes: `cut.Find(".alert-success").MarkupMatches("<div class=\"alert-success\">Order Placed!</div>");`
4. **Verification**:
   - Execute `dotnet test` to confirm tests pass.
5. **Next Step Guidance**:
   - Conclude your response by guiding the user on E2E testing:
   > "Next step: Run `/playwright-test` to generate native C# end-to-end browser tests for your use cases."
