# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

AIUP Marketplace is a collection of plugins for Claude Code that implement the AI Unified Process (AIUP) methodology.
The repository is structured as a marketplace that can host multiple technology-specific plugins.

## Repository Structure

```
aiup-marketplace/
├── .claude-plugin/
│   └── marketplace.json      # Marketplace metadata listing all plugins
├── aiup-vaadin-jooq-plugin/  # Vaadin + jOOQ technology stack plugin
│   ├── .claude-plugin/
│   │   └── plugin.json       # Plugin metadata
│   ├── .mcp.json             # MCP server configurations
│   └── commands/             # Slash commands implementing AIUP workflow
└── README.md
```

## Plugin Architecture

### Marketplace Configuration

- `marketplace.json` defines the marketplace with owner info and an array of plugins
- Each plugin entry has `name`, `source` (path), and `description`

### Plugin Structure

Each plugin contains:

- `.claude-plugin/plugin.json` - Plugin metadata (name, version, author)
- `.mcp.json` - MCP server configurations for external tools
- `commands/` - Numbered slash command files that define the AIUP workflow steps

## AIUP Workflow (Vaadin/jOOQ Plugin)

The workflow commands are numbered to indicate execution order:

1. **1_requirements.md** - Generate requirements from vision document
2. **2_entity_model.md** - Create entity model with Mermaid ER diagrams
3. **3_use_case_diagram.md** - Generate PlantUML use case diagrams
4. **4_database_migration.md** - Create Flyway migrations
5. **5_use_case_spec.md** - Write detailed use case specifications
6. **6_implement.md** - Implement use cases using Vaadin and jOOQ
7. **7_karibu_test.md** - Create Karibu unit tests
8. **8_playwright_test.md** - Create Playwright integration tests

## MCP Servers (Vaadin/jOOQ Plugin)

The plugin configures these MCP servers:

- **Vaadin** - Vaadin documentation (HTTP)
- **KaribuTesting** - Karibu testing framework docs (SSE)
- **jOOQ** - jOOQ documentation (SSE)
- **context7** - General documentation lookup (HTTP)
- **playwright** - Browser automation (stdio via npx)
