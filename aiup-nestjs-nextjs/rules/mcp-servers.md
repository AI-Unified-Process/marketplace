# Optional MCP servers for the NestJS/Next.js skills

The `aiup-nestjs-nextjs` skills work without any MCP servers — they fall back to your own
knowledge and the documentation links inside each skill. For authoritative, up-to-date docs
and browser automation, configure the optional server below in your agent. It is advisory
only; nothing in these skills hard-requires it.

## Servers

| Server     | Type  | URL / command                | Used by                                   |
|------------|-------|------------------------------|-------------------------------------------|
| playwright | stdio | `npx @playwright/mcp@latest` | `playwright-test` (running browser tests) |

## Configure in Claude Code

Add this to your project's `.mcp.json` (the Tessl `tessl mcp start` bridge can stay alongside
it):

```json
{
  "mcpServers": {
    "playwright": {
      "type": "stdio",
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    }
  }
}
```

For other agents (Cursor, Gemini, Codex, Copilot), add the same server to that agent's MCP
configuration file.

## Library docs already covered by `aiup-core`

`aiup-core`'s `.mcp.json` wires up **context7** (`https://mcp.context7.com/mcp`), a general
library-documentation server. Because it resolves docs for any npm package on demand, it
already covers every library these skills depend on:

| Library                     | Used by                                        |
|-----------------------------|------------------------------------------------|
| NestJS                      | `implement`, `nest-test`                       |
| Drizzle ORM / drizzle-kit   | `drizzle-migration`, `implement`               |
| Next.js / React             | `implement`, `react-test`                      |
| Vitest                      | `nest-test`, `react-test`                      |
| Supertest                   | `nest-test`                                    |
| Testcontainers              | `nest-test`                                    |
| React Testing Library       | `react-test`                                   |

If you have `aiup-core` installed — a prerequisite for this plugin, see the top-level README —
you get documentation lookups for all of these for free, without configuring anything extra
here.

## Note for Tessl-installed users

Tessl does not ship MCP server definitions with a plugin — installing this plugin via
`tessl install` configures only the Tessl bridge. Configure the server above manually if you
want browser automation during `playwright-test`. Users who install the plugin through the
Claude Code marketplace get it automatically from the plugin's `.mcp.json`.
