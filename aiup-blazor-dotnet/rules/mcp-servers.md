# Optional MCP servers for the Blazor/.NET skills

The `aiup-blazor-dotnet` skills work without any MCP servers — they fall back to your own knowledge and standard .NET 10 documentation patterns. For authoritative, up-to-date docs and API lookups, configure the optional MCP servers below in your agent. They are advisory only; nothing in these skills hard-requires them.

## Servers

| Server          | Type  | URL / command                                        | Used by                                   |
|-----------------|-------|------------------------------------------------------|-------------------------------------------|
| MicrosoftLearn  | http  | `https://mcp.context7.com/mcp`                       | `implement`, `ef-migration`, `dotnet-test`|
| bUnitDocs       | http  | `https://mcp.context7.com/mcp`                       | `bunit-test`                              |
| Playwright      | stdio | `npx @playwright/mcp@latest`                         | `playwright-test` (running browser tests) |

## Configure in Claude Code

Add these to your project's `.mcp.json`:

```json
{
  "mcpServers": {
    "MicrosoftLearn": { "type": "http", "url": "https://mcp.context7.com/mcp" },
    "bUnitDocs":      { "type": "http", "url": "https://mcp.context7.com/mcp" },
    "playwright":     { "type": "stdio", "command": "npx", "args": ["@playwright/mcp@latest"] }
  }
}
```
