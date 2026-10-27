<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# Optional MCP servers for the Blazor/.NET skills

The `aiup-blazor-dotnet` skills work without any MCP servers — they fall back to your own knowledge and standard .NET 10 documentation patterns. For authoritative, up-to-date docs and API lookups, configure the optional MCP servers below in your agent. They are advisory only; nothing in these skills hard-requires them.

## Servers

| Server          | Type  | URL / command                                        | Used by                                   |
|-----------------|-------|------------------------------------------------------|-------------------------------------------|
| MicrosoftLearn  | http  | `https://learn.microsoft.com/api/mcp`                | `implement`, `ef-migration`, `dotnet-test`|
| context7        | http  | `https://mcp.context7.com/mcp`                       | `bunit-test` (bUnit documentation)        |
| Playwright      | stdio | `npx @playwright/mcp@latest`                         | `playwright-test` (running browser tests) |

## Configure in Claude Code

Add these to your project's `.mcp.json`:

```json
{
  "mcpServers": {
    "MicrosoftLearn": { "type": "http", "url": "https://learn.microsoft.com/api/mcp" },
    "context7":       { "type": "http", "url": "https://mcp.context7.com/mcp" },
    "playwright":     { "type": "stdio", "command": "npx", "args": ["@playwright/mcp@latest"] }
  }
}
```
