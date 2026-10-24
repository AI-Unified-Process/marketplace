<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# Optional MCP servers for the Playwright skill

The `aiup-playwright` skill works without any MCP server — it falls back to your own knowledge and the
documentation links inside the skill. The server below lets the agent open the running application in a browser,
take an accessibility snapshot, and try a locator before it writes it into a test. It is advisory only; nothing in
the skill hard-requires it.

## Servers

| Server     | Type  | URL / command                | Used by                                                   |
|------------|-------|------------------------------|-----------------------------------------------------------|
| playwright | stdio | `npx @playwright/mcp@latest` | `playwright-e2e-test` (exploring the UI, debugging tests) |

## Configure in Claude Code

Add it to your project's `.mcp.json` (the Tessl `tessl mcp start` bridge can stay alongside it):

```json
{
  "mcpServers": {
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

For other agents (Cursor, Gemini, Codex, Copilot), add the same server to that agent's MCP configuration file.

## Library documentation

`aiup-core`'s `.mcp.json` wires up **context7** (`https://mcp.context7.com/mcp`), which resolves current
documentation for `@playwright/test` and any other npm package on demand. With `aiup-core` installed — a
prerequisite for this plugin — no extra documentation server is needed.

## Note for Tessl-installed users

Tessl ships it with the plugin: `tessl install` reads the plugin's bundled `.mcp.json` and writes it into the MCP
configuration of each agent it configures, as the Claude Code marketplace install does. If your agent does not list
it after the install — an agent Tessl does not configure, or a manual skill copy — configure the server above
manually as shown.
