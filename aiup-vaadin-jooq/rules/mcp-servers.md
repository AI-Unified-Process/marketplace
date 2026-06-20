# Optional MCP servers for the Vaadin/jOOQ skills

The `aiup-vaadin-jooq` skills work without any MCP servers — they fall back to your
own knowledge and the documentation links inside each skill. For authoritative,
up-to-date docs and API lookups, configure the optional MCP servers below in your
agent. They are advisory only; nothing in these skills hard-requires them.

## Servers

| Server          | Type  | URL / command                                        | Used by                                   |
|-----------------|-------|------------------------------------------------------|-------------------------------------------|
| Vaadin          | http  | `https://mcp.vaadin.com/docs`                        | `implement`, `browserless-test`           |
| jOOQ            | http  | `https://jooq-mcp.martinelli.ch/mcp`                 | `implement`                               |
| JavaDocs        | http  | `https://www.javadocs.dev/mcp`                       | `implement`, `playwright-test`            |
| KaribuTesting   | http  | `https://karibu-testing-mcp.martinelli.ch/mcp`       | `karibu-test`                             |
| Playwright      | stdio | `npx @playwright/mcp@latest`                         | `playwright-test` (running browser tests) |

## Configure in Claude Code

Add these to your project's `.mcp.json` (the Tessl `tessl mcp start` bridge can stay
alongside them):

```json
{
  "mcpServers": {
    "Vaadin":        { "type": "http", "url": "https://mcp.vaadin.com/docs" },
    "jOOQ":          { "type": "http", "url": "https://jooq-mcp.martinelli.ch/mcp" },
    "JavaDocs":      { "type": "http", "url": "https://www.javadocs.dev/mcp" },
    "KaribuTesting": { "type": "http", "url": "https://karibu-testing-mcp.martinelli.ch/mcp" },
    "playwright":    { "type": "stdio", "command": "npx", "args": ["@playwright/mcp@latest"] }
  }
}
```

For other agents (Cursor, Gemini, Codex, Copilot), add the same servers to that
agent's MCP configuration file.

## Note for Tessl-installed users

Tessl does not ship MCP server definitions with a plugin — installing this plugin via
`tessl install` configures only the Tessl bridge. Configure the servers above manually
if you want the enhanced documentation lookups. Users who install the plugin through
the Claude Code marketplace get these servers automatically from the plugin's
`.mcp.json`.
