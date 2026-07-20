# aiup-blazor-dotnet

> Stack-specific plugin of the [**AI Unified Process (AIUP)**](https://unifiedprocess.ai) for **C# and Blazor on .NET 10**.

`aiup-blazor-dotnet` provides implementation and testing skills for projects built with C#, EF Core, Blazor (.NET 10), bUnit, and Playwright. It consumes the specifications produced by [`aiup-core`](../aiup-core).

## Skills

| Phase        | Skill / command    | Description                                                               |
|--------------|--------------------|---------------------------------------------------------------------------|
| Construction | `/ef-migration`    | Generate native EF Core C# migrations based on `docs/entity_model.md`     |
| Construction | `/implement`       | Implement use cases using C# Vertical Slice Architecture                  |
| Construction | `/bunit-test`      | Create bUnit UI component tests for Blazor `.razor` pages                 |
| Construction | `/dotnet-test`     | Create backend unit and integration tests for EF Core and domain handlers |
| Construction | `/playwright-test` | Create native C# Playwright E2E browser tests (`Microsoft.Playwright.Xunit`)|

## Installation

Install from the Tessl registry:

```bash
tessl install aiup/aiup-blazor-dotnet
```

Or via Claude Code marketplace:

```bash
/plugin install aiup-blazor-dotnet
```
