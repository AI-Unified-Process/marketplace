<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# Install with Claude Code

Claude Code can install AI Unified Process directly from the marketplace. Install `aiup-core` in every project and add exactly one
stack plugin when the implementation stack is supported.

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

Then install one matching stack plugin:

```text
/plugin install aiup-vaadin-jooq
/plugin install aiup-angular-jpa
/plugin install aiup-blazor-dotnet
/plugin install aiup-nestjs-nextjs
```

The four commands above are alternatives, not a bundle. Projects on another stack need only `aiup-core` and can use
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
commands in one project.

Continue with [Getting started](../getting-started.md) or consult the selected plugin README for its prerequisites and
construction workflow.
