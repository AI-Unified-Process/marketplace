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
│       ├── use-case-spec/
│       ├── implement/            # Dispatcher — routes to the stack-specific implementation skill
│       ├── test/                 # Dispatcher — routes to the stack-specific server-side test skill
│       └── e2e/                  # Dispatcher — routes to the stack-specific browser-based test skill
├── aiup-vaadin-jooq/             # Vaadin + jOOQ technology stack plugin
│   ├── .claude-plugin/
│   │   └── plugin.json
│   ├── .mcp.json                 # Vaadin, KaribuTesting, jOOQ, JavaDocs, Playwright
│   └── skills/                   # All workflow steps as skills (slash commands)
│       ├── flyway-migration/
│       ├── implement-vaadin-jooq/
│       ├── browserless-test/
│       ├── karibu-test/
│       └── playwright-test/
└── README.md
```

## Plugin Architecture

### Two-Layer Design

- **aiup-core** — Stack-agnostic methodology: from vision to use case specification. Works with any tech stack.
- **vaadin-jooq** — Stack-specific: implementation and testing for the Vaadin + jOOQ stack. Requires core.

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

| Phase        | Skill (slash command) | Description                                                          |
|--------------|-----------------------|----------------------------------------------------------------------|
| Inception    | `/requirements`       | Generate requirements from vision                                    |
| Elaboration  | `/entity-model`       | Create entity model with Mermaid ER                                  |
| Elaboration  | `/use-case-diagram`   | Generate PlantUML use case diagrams                                  |
| Construction | `/use-case-spec`      | Write detailed use case specifications                               |
| Construction | `/implement`          | Stack-agnostic dispatcher — detects the stack and delegates          |
| Construction | `/test`               | Stack-agnostic dispatcher — server-side unit / integration tests     |
| Construction | `/e2e`                | Stack-agnostic dispatcher — browser-based end-to-end tests           |

### Vaadin/jOOQ (stack-specific — invoked by the core dispatchers)

| Phase        | Skill (slash command)     | Description                                                |
|--------------|---------------------------|------------------------------------------------------------|
| Construction | `/flyway-migration`       | Create Flyway migrations                                   |
| Construction | `/implement-vaadin-jooq`  | Implement use cases using Vaadin and jOOQ                  |
| Construction | `/browserless-test`       | Create Vaadin Browserless unit tests (recommended)         |
| Construction | `/karibu-test`            | Create Karibu unit tests (legacy — superseded since 25.1)  |
| Construction | `/playwright-test`        | Create Playwright integration tests                        |

The core `/implement`, `/test`, and `/e2e` skills inspect the project's build files (`pom.xml`, `build.gradle`,
`package.json`, etc.) to choose which stack-specific skill to invoke. New stack plugins (e.g. a future
`aiup-spring-react`) plug in by shipping their own `implement-<stack>` and test skills and adding a row to each
dispatcher's routing table.
