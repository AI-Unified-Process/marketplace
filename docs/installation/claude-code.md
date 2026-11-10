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
of `aiup-jooq` for JPA. A TypeScript project takes `aiup-drizzle` and `aiup-nestjs`, with `aiup-nextjs` and
`aiup-playwright` for a Next.js UI; the service and test skills of `aiup-nestjs` assume Drizzle below them. Run `/stack` once in the project to record the combination. Each layer plugin declares
`aiup-core` as a plugin dependency (3.16.0 or later; `aiup-flyway` 3.3.0), so Claude Code
installs core with it when it is missing.

Or install the combined stack plugin instead of layer plugins, for C# and Blazor:

```text
/plugin install aiup-blazor-dotnet
```

It does not go together with layer plugins. Three more combined stack plugins are deprecated in favour of the layer
plugins and will be removed with `aiup-core` 4.0.0. Install one only for a project that already uses it; the
[migration guide](../migration.md) moves such a project:

```text
/plugin install aiup-vaadin-jooq      # deprecated: use aiup-flyway, aiup-jooq, aiup-spring-boot, aiup-vaadin
/plugin install aiup-angular-jpa      # deprecated: use aiup-flyway, aiup-jpa, aiup-spring-boot, aiup-angular, aiup-playwright
/plugin install aiup-nestjs-nextjs    # deprecated: use aiup-drizzle, aiup-nestjs, aiup-nextjs, aiup-playwright
```

These are alternatives, not a bundle. Projects on another stack need only `aiup-core` and can use
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
[migration guide](../migration.md): it also covers `/stack` and the `UseCase` annotation.

Continue with [Getting started](../getting-started.md) or consult the selected plugin README for its prerequisites and
construction workflow.
