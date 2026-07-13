# Optional MCP servers for the React/Vite/JPA skills

The `aiup-react-vite-jpa` skills work without any MCP servers — they fall back to your
own knowledge and the documentation links inside each skill. For authoritative,
up-to-date docs and API lookups, configure the optional MCP servers below in your
agent. They are advisory only; nothing in these skills hard-requires them.

## Servers

| Server     | Type  | URL / command                  | Used by                                   |
|------------|-------|--------------------------------|-------------------------------------------|
| JavaDocs   | http  | `https://www.javadocs.dev/mcp` | `implement`, `spring-boot-test`           |
| playwright | stdio | `npx @playwright/mcp@latest`   | `playwright-test` (running browser tests) |

## Configure in Claude Code

Add these to your project's `.mcp.json` (the Tessl `tessl mcp start` bridge can stay
alongside them):

```json
{
  "mcpServers": {
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

## Frontend docs already covered by `aiup-core`

`aiup-core`'s `.mcp.json` wires up **context7** (`https://mcp.context7.com/mcp`), a
general library-documentation server. Because it resolves docs for any npm/JS package on
demand, it already covers React, Vite, TanStack Query, Vitest, React Testing Library, and
MSW — the libraries the `implement` and `vitest-test` skills rely on for the frontend. If
you have `aiup-core` installed (a prerequisite for this plugin — see the top-level
README), you get frontend doc lookups for free without configuring anything extra here.

## Note for Tessl-installed users

Tessl does not ship MCP server definitions with a plugin — installing this plugin via
`tessl install` configures only the Tessl bridge. Configure the servers above manually
if you want the enhanced documentation lookups. Users who install the plugin through
the Claude Code marketplace get these servers automatically from the plugin's
`.mcp.json`.

## Future opportunity

`aiup-vaadin-jooq` ships purpose-built MCP servers for jOOQ and Karibu Testing
(`jooq-mcp.martinelli.ch`, `karibu-testing-mcp.martinelli.ch`) that the plugin author
built and hosts himself. No equivalent exists yet for Spring Data JPA / Hibernate — a
dedicated server following that same pattern would be a natural addition here, but isn't
included today rather than pointing at a placeholder that doesn't exist.
