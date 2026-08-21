---
name: bunit-test
description: >
  Generates bUnit component unit and integration tests for Blazor components (.razor).
  Use when the user asks to "write bUnit tests", "test Blazor component", "create UI test for Blazor",
  or mentions bUnit, Blazor component testing, or xUnit rendering tests.
---

<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# bUnit Component Testing

## Goal

Generate unit and integration tests for Blazor `.razor` UI components using the `bUnit` testing library and `xUnit`.

## If Tests for This Component Already Exist

A diff of the specification change may follow the file path in the arguments. When it is there, it
is the definitive list of what changed — work through it change by change. A removed line means the
scenario it described was dropped: delete the tests that exist only for it instead of keeping them
as passing extras.

Before writing new tests, look for an existing test class for this use case / component (e.g.
`UC001_PlaceOrderPageTests.cs`, or any test that renders the component). If one exists, **update it
to match the current specification and implementation instead of creating a second test class**:

- Add test methods for scenarios and business rules the spec has gained since the tests were written
- Update existing test methods whose expected markup, element selectors, or mocked service
  behavior the component has changed
- Delete tests for scenarios the spec no longer contains
- Leave passing tests the spec still requires untouched
- Keep the registered mock services in sync with the component's current DI dependencies
- Run the whole test class afterwards, not only the methods you added

## Workflow

1. **Locate Target Component**:
   - Identify the Blazor component under test (e.g. `Features/UC001_PlaceOrder/PlaceOrderPage.razor`).
   - Check whether tests for it already exist. If they do, follow "If Tests for This Component Already Exist" above and update them instead of adding a parallel test class.
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
