<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# Install with Tessl

[Tessl](https://tessl.io) installs versioned AI Unified Process plugins for supported coding agents and records them in the
project's `tessl.json` manifest.

## Initialize the project

From the target project, configure one or more agents:

```sh
tessl init --agent agents
```

Use the agent identifier supported by your Tessl version, such as `claude-code`, `cursor`, `gemini`, `codex`,
`copilot`, `copilot-vscode`, or the vendor-neutral `agents` layout. Repeat `--agent` when configuring several agents.

## Install plugins

Install `aiup-core` and one stack plugin:

```sh
tessl install ai-unified-process/aiup-core
tessl install ai-unified-process/aiup-vaadin-jooq
```

Available stack packages are:

```text
ai-unified-process/aiup-vaadin-jooq
ai-unified-process/aiup-angular-jpa
ai-unified-process/aiup-blazor-dotnet
ai-unified-process/aiup-nestjs-nextjs
```

Use only `aiup-core` for an unsupported implementation stack. Use only one of the four stack packages in a project.

## Versions and team use

Installed plugins live under `.tessl/plugins/` and are tracked by `tessl.json`. Commit the manifest so every team
member installs the same versions. A package can be pinned explicitly with Tessl's `@version` syntax when the team does
not want automatic resolution to a newer release.

Tessl maps skills and MCP configuration into the selected agent layouts. Slash-command behavior can still differ
between hosts; when a command is not exposed, invoke the skill by intent, for example "implement UC-001".

## Verify the installation

Open the configured agent in the target project and request the requirements catalog. The agent should discover the
AI Unified Process requirements skill and read `docs/vision.md`. If it does not, inspect `tessl.json`, confirm that the configured
agent matches the one being run, and rerun the Tessl installation.

Continue with [Getting started](../getting-started.md). For manual layouts and host-specific MCP examples, see
[Agent Plugins and manual installation](other-agents.md).
