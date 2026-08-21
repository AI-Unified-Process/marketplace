<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# Agent Plugins and manual installation

AI Unified Process is a methodology implemented as portable Agent Skills. Every plugin directory is also an
[Agent Plugins](https://agent-plugins.org) package with a root `plugin.json`, `mcp.json`, and `skills/` directory.
Clients that implement the standard can load a plugin directly from a checkout of this repository.

For most supported agents, [Tessl](tessl.md) is the shortest installation path. Use this page when adopting the
packages directly or configuring skills and MCP servers by hand.

## What is portable

| Component                    | Portability   | Notes                                                                     |
|------------------------------|---------------|---------------------------------------------------------------------------|
| `skills/*/SKILL.md`          | Portable      | Conforms to the Agent Skills layout and can be invoked by intent          |
| `agents/*.md`                | Host-specific | Claude Code loads them as sub-agents; elsewhere use the file as a checklist |
| `plugin.json`                | Portable      | Agent Plugins v1.0.0 package manifest                                     |
| `mcp.json`                   | Portable      | Agent Plugins MCP definitions; host configuration shapes may differ       |
| AI Unified Process artifacts | Portable      | Markdown, Mermaid, and PlantUML files are the contract between steps      |
| Slash commands               | Host-specific | If `/command` routing is unavailable, state the same intent in the prompt |

## Load an Agent Plugins package

Clone the repository and point an Agent Plugins-conformant client at `aiup-core` plus one stack directory:

```sh
git clone https://github.com/AI-Unified-Process/marketplace.git
```

The manifests are validated against the Claude Code and Tessl variants in CI. Consult the client's documentation for
the command or UI used to add a local package.

## Manual installation

Without an Agent Plugins loader:

1. Clone this repository next to the target project or add it as a submodule.
2. Copy or symlink the skill folders from `aiup-core/skills/` and one stack plugin's `skills/` into the location
   scanned by the coding agent.
3. Translate the MCP servers from the plugins' `mcp.json` into the host's MCP configuration.
4. Start the agent in the target project and ask it to generate requirements from `docs/vision.md`.

Install whole skill directories, not only their `SKILL.md` files. Some skills also use bundled references and scripts.

## OpenAI Codex

Codex discovers repository skills from `.agents/skills/` between the current working directory and repository root,
and user-level skills from `$HOME/.agents/skills/`. It supports symlinked skill directories. For example:

```sh
mkdir -p .agents/skills
ln -s /path/to/marketplace/aiup-core/skills/requirements .agents/skills/requirements
```

Configure MCP servers in `~/.codex/config.toml`, or use a trusted project's `.codex/config.toml` for project-scoped
configuration:

```toml
[mcp_servers.Vaadin]
url = "https://mcp.vaadin.com/docs"

[mcp_servers.playwright]
command = "npx"
args = ["@playwright/mcp@latest"]
```

See the official OpenAI documentation for
[building Codex skills](https://developers.openai.com/codex/build-skills) and the
[Codex configuration reference](https://developers.openai.com/codex/config-reference).

## Cursor

Place project skills under `.cursor/skills/` or `.agents/skills/`. For skills that should be available to the user in
every project, use `~/.cursor/skills/` or `~/.agents/skills/`. Cursor also recognizes the compatible `.claude/skills/`
and `.codex/skills/` layouts. Configure MCP servers in the project's `.cursor/mcp.json` or the user's Cursor MCP
configuration. HTTP definitions use a URL; local servers use a command and arguments.

## GitHub Copilot

Copilot can discover skills from repository locations including `.github/skills/`, `.claude/skills/`, and
`.agents/skills/`. For a manual MCP setup in VS Code, place shared server definitions in `.vscode/mcp.json`:

```jsonc
{
  "servers": {
    "Vaadin": { "type": "http", "url": "https://mcp.vaadin.com/docs" },
    "playwright": { "command": "npx", "args": ["@playwright/mcp@latest"] }
  }
}
```

Copilot environments that support Claude Code plugin marketplaces can alternatively use the commands from the
[Claude Code installation guide](claude-code.md).

## Gemini CLI

Place skills under `.gemini/skills/` in the project or the corresponding user-level directory. Gemini's
`mcpServers` settings use the familiar URL or command-and-arguments shape, so the plugin MCP definitions require only
minor translation.

## OpenCode

Place skills under `.opencode/skills/` in the project or the configured user skill directory. OpenCode also scans
common `.claude/skills/` and `.agents/skills/` layouts. Its `opencode.json` uses `type: "remote"` with a URL for HTTP
servers and `type: "local"` with a command array for local servers:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "Vaadin": {
      "type": "remote",
      "url": "https://mcp.vaadin.com/docs"
    },
    "playwright": {
      "type": "local",
      "command": [
        "npx",
        "@playwright/mcp@latest"
      ]
    }
  }
}
```

## Invocation differences

- When slash commands are unavailable, say "specify UC-001", "implement UC-001", or "test TC-001". The agent can
  match the request to a skill's description.
- Pass identifiers in the chat message when the host does not support positional slash-command arguments.
- HTTP MCP is not supported by every client. A stdio-only client needs an HTTP-to-stdio bridge for remote servers.
- Sub-agents are not part of the Agent Plugins standard. Where a host cannot delegate to
  [`uc-coverage`](../../aiup-vaadin-jooq/agents/uc-coverage.md), point the assistant at that file and ask it to run
  the coverage check itself — the checklist is host-independent.
- The files under `docs/` remain compatible even when different steps are run by different agents.

Host capabilities and configuration paths evolve independently. Check the host's current documentation if its layout
differs from the examples above.
