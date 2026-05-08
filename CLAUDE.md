# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

AI Unified Process Marketplace is a collection of plugins for Claude Code that implement the AI Unified Process
methodology.
The repository is structured as a marketplace with a two-layer architecture: a stack-agnostic core and
technology-specific plugins.

## Repository Structure

```
marketplace/
├── .claude-plugin/
│   └── marketplace.json          # Marketplace metadata listing all plugins
├── aiup-core/                    # Stack-agnostic core methodology
│   ├── .claude-plugin/
│   │   └── plugin.json
│   ├── .mcp.json                 # context7
│   └── skills/                   # All workflow steps as skills (slash commands)
│       ├── requirements/
│       ├── entity-model/
│       ├── use-case-diagram/
│       └── use-case-spec/
├── aiup-vaadin-jooq/             # Vaadin + jOOQ technology stack plugin
│   ├── .claude-plugin/
│   │   └── plugin.json
│   ├── .mcp.json                 # Vaadin, KaribuTesting, jOOQ, JavaDocs, Playwright
│   └── skills/                   # All workflow steps as skills (slash commands)
│       ├── flyway-migration/
│       ├── implement/
│       ├── karibu-test/
│       └── playwright-test/
├── aiup-compose-ktor-exposed/    # Kotlin KMP + Compose + Ktor + Exposed stack plugin
│   ├── .claude-plugin/
│   │   └── plugin.json
│   ├── .mcp.json                 # KotlinDocs (javadocs.dev)
│   └── skills/                   # All workflow steps as skills (slash commands)
│       ├── flyway-migration/
│       ├── implement/
│       ├── implement-ui/
│       ├── ktor-test/
│       └── compose-test/
└── README.md
```

## Plugin Architecture

### Two-Layer Design

- **aiup-core** — Stack-agnostic methodology: from vision to use case specification. Works with any tech stack.
- **aiup-vaadin-jooq** — Stack-specific: implementation and testing for the Vaadin + jOOQ stack. Requires core.
- **aiup-compose-ktor-exposed** — Stack-specific: implementation and testing for the Kotlin KMP + Compose + Ktor + Exposed stack. Requires core.

### Marketplace Configuration

- `marketplace.json` defines the marketplace with owner info and an array of plugins
- Each plugin entry has `name`, `source` (path), and `description`

### Plugin Structure

Each plugin contains:

- `.claude-plugin/plugin.json` - Plugin metadata (name, version, author)
- `.mcp.json` - MCP server configurations for external tools
- `skills/` - Skills with SKILL.md definitions; each skill is also a slash command

## AI Unified Process Workflow

Skills follow the AI Unified Process phases: Inception, Elaboration, Construction, Transition.

### Core (stack-agnostic)

| Phase        | Skill (slash command) | Description                            |
|--------------|-----------------------|----------------------------------------|
| Inception    | `/requirements`       | Generate requirements from vision      |
| Elaboration  | `/entity-model`       | Create entity model with Mermaid ER    |
| Elaboration  | `/use-case-diagram`   | Generate PlantUML use case diagrams    |
| Construction | `/use-case-spec`      | Write detailed use case specifications |

### Vaadin/jOOQ (stack-specific)

| Phase        | Skill (slash command) | Description                               |
|--------------|-----------------------|-------------------------------------------|
| Construction | `/flyway-migration`   | Create Flyway migrations                                 |
| Construction | `/implement`          | Implement use cases using Vaadin and jOOQ                |
| Construction | `/browserless-test`   | Create Vaadin Browserless unit tests (recommended)       |
| Construction | `/karibu-test`        | Create Karibu unit tests (legacy — superseded since 25.1) |
| Construction | `/playwright-test`    | Create Playwright integration tests                      |

### Compose/Ktor/Exposed (stack-specific)

| Phase        | Skill (slash command) | Description                                              |
|--------------|-----------------------|----------------------------------------------------------|
| Construction | `/flyway-migration`   | Create Flyway PostgreSQL migrations from entity model    |
| Construction | `/implement`          | Implement backend: shared DTOs + Exposed DSL + Ktor routes |
| Construction | `/implement-ui`       | Implement UI: Compose Multiplatform screens + Ktor Client  |
| Construction | `/ktor-test`          | Create Ktor testApplication API tests                    |
| Construction | `/compose-test`       | Create Compose UI tests with runComposeUiTest            |
