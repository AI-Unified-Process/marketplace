# Optional MCP servers for the Angular/JPA skills

The `aiup-angular-jpa` skills work without any MCP servers — they fall back to your
own knowledge and the documentation links inside each skill. For authoritative,
up-to-date docs, API lookups, and CLI-integrated tooling, configure the optional MCP
servers below in your agent. They are advisory only; nothing in these skills
hard-requires them.

## Servers

| Server      | Type  | URL / command                  | Used by                                       |
|-------------|-------|--------------------------------|-----------------------------------------------|
| JavaDocs    | http  | `https://www.javadocs.dev/mcp` | `implement`, `spring-boot-test`               |
| angular-cli | stdio | `npx -y @angular/cli mcp`      | `implement`, `vitest-test`, `playwright-test` |
| playwright  | stdio | `npx @playwright/mcp@latest`   | `playwright-test` (running browser tests)     |

### `angular-cli` — official Angular CLI MCP server

Ships with `@angular/cli` itself (Angular 22+) — no separate package to install beyond
what an Angular project already depends on. It's a genuine, first-party server, not a
community wrapper. Exposed tools relevant to this plugin:

| Tool                                            | Used for                                                                                                                                                                                       |
|-------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `search_documentation`                          | Authoritative Angular docs lookup — prefer this over general web search for Angular-specific API questions                                                                                     |
| `get_best_practices`                            | The official Angular Best Practices Guide — cross-check generated code against it                                                                                                              |
| `onpush_zoneless_migration`                     | Analyzes a component's actual change-detection setup — use this instead of guessing whether a project is zoneless or which `ChangeDetectionStrategy` it already standardizes on                |
| `list_projects`                                 | Enumerates apps/libraries in an Angular workspace — useful for detecting the frontend's actual structure before `/implement` writes new files                                                  |
| `run_target`                                    | Runs a configured target (`build`, `test`, `lint`, `e2e`) — use for the `implement` skill's `ng build` verification step and the `vitest-test`/`playwright-test` skills' "run to verify" steps |
| `devserver.start` / `.stop` / `.wait_for_build` | Launches/stops `ng serve` and retrieves build logs — useful for `playwright-test`, which needs the dev server running before it can execute                                                    |
| `ai_tutor`                                      | Interactive Angular learning environment — not used by these skills directly, but harmless to have available                                                                                   |

Two optional CLI flags worth knowing about (append to the `args` array in the config
below): `--read-only` registers only non-modifying tools (drops `devserver.start`,
`run_target`, etc.) if you'd rather the server never take action on its own; `--local-only`
drops any tool that needs internet access (e.g. `search_documentation`). Neither is set
by default here since the skills legitimately use the full tool set.

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
    "angular-cli": {
      "type": "stdio",
      "command": "npx",
      "args": [
        "-y",
        "@angular/cli",
        "mcp"
      ]
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
agent's MCP configuration file — `angular-cli` is host-agnostic since it's a standard
stdio MCP server; see [angular.dev/ai/mcp](https://angular.dev/ai/mcp) for editor-specific
setup notes (VS Code, JetBrains, etc.) beyond the generic JSON above.

## Frontend docs already covered by `aiup-core`

`aiup-core`'s `.mcp.json` wires up **context7** (`https://mcp.context7.com/mcp`), a
general library-documentation server. It covers RxJS, Vitest, and any other npm package
on the classpath. For Angular itself specifically, prefer `angular-cli`'s
`search_documentation` and `get_best_practices` tools — they're first-party and
version-aware in a way a general doc server can't be. Use context7 as the fallback for
non-Angular frontend libraries.

## Note for Tessl-installed users

Tessl does not ship MCP server definitions with a plugin — installing this plugin via
`tessl install` configures only the Tessl bridge. Configure the servers above manually
if you want the enhanced documentation lookups. Users who install the plugin through
the Claude Code marketplace get these servers automatically from the plugin's
`.mcp.json`.

## Future opportunity

`aiup-vaadin-jooq` ships purpose-built MCP servers for jOOQ and Karibu Testing that the
plugin author built and hosts himself. No equivalent exists yet for Spring Data JPA/
Hibernate specifically — a dedicated server following that same pattern would be a
natural addition here, but isn't included today rather than pointing at a placeholder
that doesn't exist.
