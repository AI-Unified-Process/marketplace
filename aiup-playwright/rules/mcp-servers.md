<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# Optional MCP servers for the Playwright skill

The `aiup-playwright` skill works without any MCP server — it falls back to your own knowledge and the
documentation links inside the skill. The servers below look up current `@playwright/test` documentation and let the agent
open the running application in a browser, take an accessibility snapshot, and try a locator before it writes it
into a test. They are advisory only; nothing in the skill hard-requires them.

## Servers

| Server     | Type  | URL / command                   | Used by                                                   |
|------------|-------|---------------------------------|-----------------------------------------------------------|
| context7   | http  | `https://mcp.context7.com/mcp`  | `playwright-e2e-test` (`@playwright/test` documentation)  |
| playwright | stdio | `npx @playwright/mcp@latest`    | `playwright-e2e-test` (exploring the UI, debugging tests) |

## Configure in Claude Code

Add them to your project's `.mcp.json` (the Tessl `tessl mcp start` bridge can stay alongside them):

```json
{
  "mcpServers": {
    "context7": {
      "type": "http",
      "url": "https://mcp.context7.com/mcp"
    },
    "playwright": {
      "type": "stdio",
      "command": "npx",
      "args": [
        "@playwright/mcp@latest"
      ]
    }
  }
}
```

For other agents (Cursor, Gemini, Codex, Copilot), add the same servers to that agent's MCP configuration file.

## Note for Tessl-installed users

Tessl ships them with the plugin: `tessl install` reads the plugin's bundled `.mcp.json` and writes them into the MCP
configuration of each agent it configures, as the Claude Code marketplace install does. If your agent does not list
them after the install — an agent Tessl does not configure, or a manual skill copy — configure the servers above
manually as shown.
