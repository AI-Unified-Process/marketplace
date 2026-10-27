<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# Optional MCP servers for the NestJS/Next.js skills

The `aiup-nestjs-nextjs` skills work without any MCP servers — they fall back to your own
knowledge and the documentation links inside each skill. For authoritative, up-to-date docs
and browser automation, configure the optional servers below in your agent. They are advisory
only; nothing in these skills hard-requires them.

## Servers

| Server     | Type  | URL / command                  | Used by                                         |
|------------|-------|--------------------------------|-------------------------------------------------|
| context7   | http  | `https://mcp.context7.com/mcp` | `implement`, `drizzle-migration`, `nest-test`, `react-test` |
| playwright | stdio | `npx @playwright/mcp@latest`   | `playwright-test` (running browser tests)       |

## Configure in Claude Code

Add these to your project's `.mcp.json` (the Tessl `tessl mcp start` bridge can stay alongside
them):

```json
{
  "mcpServers": {
    "context7": { "type": "http", "url": "https://mcp.context7.com/mcp" },
    "playwright": {
      "type": "stdio",
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    }
  }
}
```

For other agents (Cursor, Gemini, Codex, Copilot), add the same servers to that agent's MCP
configuration file.

## Library docs through context7

**context7** is a general library-documentation server. Because it resolves docs for any npm
package on demand, it covers every library these skills depend on:

| Library                     | Used by                                        |
|-----------------------------|------------------------------------------------|
| NestJS                      | `implement`, `nest-test`                       |
| Drizzle ORM / drizzle-kit   | `drizzle-migration`, `implement`               |
| Next.js / React             | `implement`, `react-test`                      |
| Vitest                      | `nest-test`, `react-test`                      |
| Supertest                   | `nest-test`                                    |
| Testcontainers              | `nest-test`                                    |
| React Testing Library       | `react-test`                                   |

## Note for Tessl-installed users

Tessl ships them with the plugin: `tessl install` reads the plugin's bundled `.mcp.json` and
writes them into the MCP configuration of each agent it configures, as the Claude Code
marketplace install does. If your agent does not list them after the install — an agent Tessl
does not configure, or a manual skill copy — configure the servers above manually as shown.
