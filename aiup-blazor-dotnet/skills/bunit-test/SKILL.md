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
   - Inherit from `Bunit.TestContext` (or use `bUnit` test fixture).
   - Register mock services using `Services.AddSingleton` or `Services.AddScoped`.
   - Setup authentication context if required (`var authContext = this.AddTestAuthorization();`).
   - Mock JSInterop calls if the component invokes browser APIs (`JSInterop.SetupVoid("localStorage.setItem").SetVoidResult();`).
3. **Render & Test Component**:
   - Render component: `var cut = RenderComponent<PlaceOrderPage>();`
   - Interact with elements: `cut.Find("button#submit").Click();`
   - **Handle Asynchronous State**: For async operations or data fetching (`OnInitializedAsync`), use `cut.WaitForState(() => cut.Find(".alert-success").TextContent.Contains("Order Placed"))` or `cut.WaitForAssertion(() => ...)` before making assertions.
   - Assert DOM changes: `cut.Find(".alert-success").MarkupMatches("<div class=\"alert-success\">Order Placed!</div>");`
4. **Verification**:
   - Execute `dotnet test` to confirm tests pass.
5. **Next Step Guidance**:
   - Conclude your response by guiding the user on E2E testing:
   > "Next step: Run `/playwright-test` to generate native C# end-to-end browser tests for your use cases."
