<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# Optional MCP servers for the Angular/JPA skills

The `aiup-angular-jpa` skills work without any MCP servers — they fall back to your
own knowledge and the documentation links inside each skill. For authoritative,
up-to-date docs, API lookups, and CLI-integrated tooling, configure the optional MCP
servers below in your agent. They are advisory only; nothing in these skills
hard-requires them.

## Servers

| Server      | Type  | URL / command                  | Used by                                       |
|-------------|-------|--------------------------------|-----------------------------------------------|
| context7    | http  | `https://mcp.context7.com/mcp` | `implement`, `vitest-test` (frontend docs)    |
| JavaDocs    | http  | `https://www.javadocs.dev/mcp` | `implement`, `spring-boot-test`               |
| playwright  | stdio | `npx @playwright/mcp@latest`   | `playwright-test` (running browser tests)     |

## Configure in Claude Code

Add these to your project's `.mcp.json` (the Tessl `tessl mcp start` bridge can stay
alongside them):

```json
{
  "mcpServers": {
    "context7": {
      "type": "http",
      "url": "https://mcp.context7.com/mcp"
    },
    "JavaDocs": {
      "type": "http",
      "url": "https://www.javadocs.dev/mcp"
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

For other agents (Cursor, Gemini, Codex, Copilot), add the same servers to that
agent's MCP configuration file.

## Frontend docs through context7

**context7** is a general library-documentation server. Because it resolves docs for any
npm/JS package on demand, it covers Angular, RxJS, and Vitest — the libraries the
`implement` and `vitest-test` skills rely on for the frontend.

## Note for Tessl-installed users

Tessl ships these servers with the plugin: `tessl install` reads the plugin's bundled
`.mcp.json` and writes them into the MCP configuration of each agent it configures, as
the Claude Code marketplace install does. If your agent does not list them after the
install — an agent Tessl does not configure, or a manual skill copy — configure the
servers above manually as shown.

## Future opportunity

`aiup-vaadin-jooq` ships purpose-built MCP servers for jOOQ and Karibu Testing that the
plugin author built and hosts himself. No equivalent exists yet for Spring Data JPA/
Hibernate specifically — a dedicated server following that same pattern would be a
natural addition here, but isn't included today.
