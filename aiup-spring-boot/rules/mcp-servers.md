<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# Optional MCP servers for the Spring Boot skills

The `aiup-spring-boot` skills work without any MCP servers — they fall back to your own knowledge and the
documentation links inside each skill. For authoritative, up-to-date API lookups, configure the optional MCP server
below in your agent. It is advisory only; nothing in these skills hard-requires it.

## Servers

| Server   | Type | URL                            | Used by                                                                |
|----------|------|--------------------------------|------------------------------------------------------------------------|
| JavaDocs | http | `https://www.javadocs.dev/mcp` | `spring-service`, `spring-rest`, `spring-service-test`, `spring-rest-test` |

## Configure in Claude Code

Add this to your project's `.mcp.json` (the Tessl `tessl mcp start` bridge can stay alongside it):

```json
{
  "mcpServers": {
    "JavaDocs": { "type": "http", "url": "https://www.javadocs.dev/mcp" }
  }
}
```

For other agents (Cursor, Gemini, Codex, Copilot), add the same server to that agent's MCP configuration file.

## Note for Tessl-installed users

Tessl ships it with the plugin: `tessl install` reads the plugin's bundled `.mcp.json` and writes it into the MCP
configuration of each agent it configures, as the Claude Code marketplace install does. If your agent does not list
it after the install — an agent Tessl does not configure, or a manual skill copy — configure the server above
manually as shown.
