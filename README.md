# AIUP Marketplace

A collection of plugins that bring the [AI Unified Process](https://aiup.dev) methodology directly into Claude Code.

## What is AIUP?

The AI Unified Process (AIUP) is a methodology that keeps requirements at the center of your development process. It
provides a structured workflow from vision to implementation, ensuring consistency and traceability throughout your
project.

## Architecture

The marketplace is organized in two layers:

- **aiup-core** — Stack-agnostic methodology (requirements, entity model, use cases). Works with any tech stack.
- **aiup-vaadin-jooq** — Stack-specific implementation and testing for the Vaadin + jOOQ technology stack.

Skills follow the [AIUP phases](https://aiup.dev) (based on the Rational Unified Process):

|                      | Inception       | Elaboration                            | Construction                                                                | Transition |
|----------------------|-----------------|----------------------------------------|-----------------------------------------------------------------------------|------------|
| **aiup-core**        | `/requirements` | `/entity-model`<br>`/use-case-diagram` | `/use-case-spec`                                                            |            |
| **aiup-vaadin-jooq** |                 |                                        | `/flyway-migration`<br>`/implement`<br>`/karibu-test`<br>`/playwright-test` |            |

## Installation

```
/plugin marketplace add martinellich/aiup-marketplace
/plugin install aiup-core
/plugin install aiup-vaadin-jooq
```

## Available Plugins

### aiup-core

Stack-agnostic core methodology plugin. Use this for any project, regardless of technology stack.

#### Skills

| Skill / Command     | Description                                                                  |
|---------------------|------------------------------------------------------------------------------|
| `/requirements`     | Creates requirements catalogs from vision document                           |
| `/entity-model`     | Creates entity models with Mermaid ER diagrams and attribute tables          |
| `/use-case-diagram` | Generate PlantUML use case diagrams                                          |
| `/use-case-spec`    | Creates use case specifications with structured scenarios and business rules |

#### MCP Servers

| Server       | Description                          |
|--------------|--------------------------------------|
| **context7** | General library documentation lookup |

### aiup-vaadin-jooq

Stack-specific plugin for Java web application development using the Vaadin + jOOQ technology stack.
Requires **aiup-core** for the methodology skills.

#### Skills

| Skill / Command     | Description                                           |
|---------------------|-------------------------------------------------------|
| `/flyway-migration` | Creates Flyway database migration scripts             |
| `/implement`        | Implements use cases using Vaadin and jOOQ            |
| `/karibu-test`      | Creates Karibu unit tests for Vaadin views            |
| `/playwright-test`  | Creates Playwright integration tests for Vaadin views |

#### MCP Servers

| Server            | Description                            |
|-------------------|----------------------------------------|
| **Vaadin**        | Access to Vaadin documentation         |
| **KaribuTesting** | Karibu testing framework documentation |
| **jOOQ**          | jOOQ documentation                     |
| **JavaDocs**      | Java API documentation                 |
| **Playwright**    | Browser automation for testing         |

## Learn More

Visit [aiup.dev](https://aiup.dev) to learn more about the AI Unified Process methodology.

## Key Concepts

### Marketplace

A **marketplace** is a curated repository that hosts and distributes multiple Claude Code plugins. It acts as a central
hub where plugins can be discovered, installed, and managed. When you add a marketplace to Claude Code, you gain access
to all the plugins it contains. Marketplaces make it easy to share and distribute collections of related plugins.

### Plugin

A **plugin** is a self-contained extension that adds new capabilities to Claude Code. Each plugin can include:

- **Skills** - Behaviors that Claude can invoke autonomously or that users invoke as slash commands
- **Agents** - Specialized subagents for complex tasks
- **Hooks** - Event handlers that respond to Claude Code events
- **MCP Servers** - External tools and documentation sources

Plugins are technology-specific and encapsulate everything needed to work with a particular tech stack or methodology.
When enabled, a plugin's components become available in your Claude Code session.

### Skill

A **skill** is a specialized behavior defined in a `SKILL.md` file. Skills can be invoked explicitly as slash
commands (e.g., `/requirements`) or triggered automatically by Claude when it recognizes a matching task. Each skill
can include supporting files like templates and reference documents. Skills are namespaced by their plugin
(e.g., `aiup-core:requirements`).

### Agent

An **agent** (or subagent) is a specialized AI assistant designed for specific task types. Each agent operates in its
own context window, separate from the main conversation, which preserves context and allows focused expertise. Claude
can delegate tasks to agents automatically, or users can invoke them explicitly. Agents can have restricted tool access
and custom system prompts tailored to their specialty.

### Hook

A **hook** is an event handler that executes automatically in response to Claude Code events. Hooks can respond to
events like tool usage, permission requests, prompt submissions, and session lifecycle events. They enable automation,
validation, and custom workflows triggered by specific actions.

### MCP Server

An **MCP (Model Context Protocol) Server** is an external service that provides Claude with access to specialized tools,
documentation, and capabilities. MCP servers extend what Claude can do by connecting it to external resources like
documentation databases, APIs, browser automation, and other integrations. They start automatically when the plugin is
enabled.

