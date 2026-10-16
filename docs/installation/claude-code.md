<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# Install with Claude Code

Claude Code can install AI Unified Process directly from the marketplace. Install `aiup-core` in every project, then add either the
layer plugins of the stack — one per technical layer — or exactly one combined stack plugin, never both.

## Prerequisites

- Claude Code is installed and can open the target project.
- The target project contains a `docs/vision.md` file for the forward workflow, or existing code for
  `/reverse-engineer`.
- Stack-specific prerequisites from the selected plugin README are available.

## Add the marketplace

Run this once in Claude Code:

```text
/plugin marketplace add ai-unified-process/marketplace
```

## Install plugins

Install the core plugin:

```text
/plugin install aiup-core
```

Then install the layer plugins of your stack — one per layer. A REST API with Spring Boot and jOOQ:

```text
/plugin install aiup-flyway
/plugin install aiup-jooq
/plugin install aiup-spring-boot
```

Add `aiup-vaadin` for a Vaadin UI, or `aiup-angular` and `aiup-playwright` for an Angular UI; take `aiup-jpa` instead
of `aiup-jooq` for JPA. Run `/architecture` once in the project to record the combination. Each layer plugin declares
`aiup-core` 3.0.0 or later as a plugin dependency, so Claude Code installs core with it when it is missing.

Or install one combined stack plugin instead of layer plugins:

```text
/plugin install aiup-vaadin-jooq
/plugin install aiup-angular-jpa
/plugin install aiup-blazor-dotnet
/plugin install aiup-nestjs-nextjs
```

These four commands are alternatives, not a bundle, and none of them goes together with layer plugins.
`aiup-vaadin-jooq` and `aiup-angular-jpa` are deprecated in favour of the layer plugins and will be removed with
`aiup-core` 4.0.0; the
[migration guide](../migration.md) moves an existing project. Projects on another stack need only `aiup-core` and can use
their own implementation workflow after the specification boundary.

## Verify the installation

Start Claude Code in the target project and run:

```text
/requirements
```

The skill should read `docs/vision.md` and propose a requirements catalog. Existing applications without a vision
document can start with `/reverse-engineer`, but that skill is not a non-mutating installation check: it creates an
entity model, use case diagram, and use case specifications under `docs/`. Review those artifacts after it completes.

## Update or change the stack plugin

Keep the core plugin installed when changing the implementation stack. Remove the old stack plugin through Claude
Code's plugin management and install the new one; do not keep multiple plugins that expose the same construction
commands in one project. To move from a combined stack plugin to the layer plugins, follow the
[migration guide](../migration.md): it also covers `/architecture` and the `UseCase` annotation.

Continue with [Getting started](../getting-started.md) or consult the selected plugin README for its prerequisites and
construction workflow.
