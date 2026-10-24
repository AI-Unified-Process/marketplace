<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# Optional MCP servers for the Vaadin skills

The `aiup-vaadin` skills work without any MCP servers — they fall back to your own knowledge and the documentation
links inside each skill. For authoritative, up-to-date docs and API lookups, configure the optional MCP servers
below in your agent. They are advisory only; nothing in these skills hard-requires them.

## Servers

| Server     | Type  | URL / command                 | Used by                                                                  |
|------------|-------|-------------------------------|--------------------------------------------------------------------------|
| Vaadin     | http  | `https://mcp.vaadin.com/docs` | `vaadin-flow-ui`, `hilla-ui`, `vaadin-flow-ui-test`, `hilla-ui-test`     |
| Playwright | stdio | `npx @playwright/mcp@latest`  | `vaadin-e2e-test` (exploring the running application)                    |

## Configure in Claude Code

Add these to your project's `.mcp.json` (the Tessl `tessl mcp start` bridge can stay alongside them):

```json
{
  "mcpServers": {
    "Vaadin":     { "type": "http", "url": "https://mcp.vaadin.com/docs" },
    "playwright": { "type": "stdio", "command": "npx", "args": ["@playwright/mcp@latest"] }
  }
}
```

For other agents (Cursor, Gemini, Codex, Copilot), add the same servers to that agent's MCP configuration file.

## Note for Tessl-installed users

Tessl ships these servers with the plugin: `tessl install` reads the plugin's bundled `.mcp.json` and writes them
into the MCP configuration of each agent it configures, as the Claude Code marketplace install does. If your
agent does not list them after the install — an agent Tessl does not configure, or a manual skill copy —
configure the servers above manually as shown.
