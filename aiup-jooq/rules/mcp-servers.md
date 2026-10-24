<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# Optional MCP servers for the jOOQ skills

The `aiup-jooq` skills work without any MCP servers — they fall back to your own knowledge and the documentation
links inside each skill. For authoritative, up-to-date docs and API lookups, configure the optional MCP servers
below in your agent. They are advisory only; nothing in these skills hard-requires them.

## Servers

| Server   | Type | URL                                  | Used by                                       |
|----------|------|--------------------------------------|-----------------------------------------------|
| jOOQ     | http | `https://jooq-mcp.martinelli.ch/mcp` | `jooq-persistence`, `jooq-persistence-test`   |
| JavaDocs | http | `https://www.javadocs.dev/mcp`       | `jooq-persistence`, `jooq-persistence-test`   |

## Configure in Claude Code

Add these to your project's `.mcp.json` (the Tessl `tessl mcp start` bridge can stay alongside them):

```json
{
  "mcpServers": {
    "jOOQ":     { "type": "http", "url": "https://jooq-mcp.martinelli.ch/mcp" },
    "JavaDocs": { "type": "http", "url": "https://www.javadocs.dev/mcp" }
  }
}
```

For other agents (Cursor, Gemini, Codex, Copilot), add the same servers to that agent's MCP configuration file.

## Note for Tessl-installed users

Tessl ships these servers with the plugin: `tessl install` reads the plugin's bundled `.mcp.json` and writes them
into the MCP configuration of each agent it configures, as the Claude Code marketplace install does. If your agent
does not list them after the install — an agent Tessl does not configure, or a manual skill copy — configure the
servers above manually as shown.
