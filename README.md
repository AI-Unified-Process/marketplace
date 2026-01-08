# AIUP Marketplace

A collection of plugins that bring the [AI Unified Process](https://aiup.dev) methodology directly into Claude Code.

## What is AIUP?

The AI Unified Process (AIUP) is a methodology that keeps requirements at the center of your development process. It
provides a structured workflow from vision to implementation, ensuring consistency and traceability throughout your
project.

## Key Concepts

### Marketplace

A **marketplace** is a curated repository that hosts and distributes multiple Claude Code plugins. It acts as a central
hub where plugins can be discovered, installed, and managed. When you add a marketplace to Claude Code, you gain access
to all the plugins it contains. Marketplaces make it easy to share and distribute collections of related plugins.

### Plugin

A **plugin** is a self-contained extension that adds new capabilities to Claude Code. Each plugin can include:

- **Commands** - Slash commands that trigger specific workflows
- **Agents** - Specialized subagents for complex tasks
- **Skills** - Behaviors that Claude can invoke autonomously
- **Hooks** - Event handlers that respond to Claude Code events
- **MCP Servers** - External tools and documentation sources

Plugins are technology-specific and encapsulate everything needed to work with a particular tech stack or methodology.
When enabled, a plugin's components become available in your Claude Code session.

### Command

A **command** is a slash-invoked instruction (e.g., `/my-command`) defined in a Markdown file. Commands contain prompts
that guide Claude through specific tasks, specifying what to do, what context to consider, and what output to produce.
Commands can accept arguments and be chained together to form complete workflows.

### Agent

An **agent** (or subagent) is a specialized AI assistant designed for specific task types. Each agent operates in its
own context window, separate from the main conversation, which preserves context and allows focused expertise. Claude
can delegate tasks to agents automatically, or users can invoke them explicitly. Agents can have restricted tool access
and custom system prompts tailored to their specialty.

### Skill

A **skill** is a specialized behavior that Claude invokes autonomously when it recognizes a matching task. Unlike
commands which require explicit user invocation, skills are triggered by Claude based on task context. Each skill is
defined in a `SKILL.md` file and can include supporting scripts and resources.

### Hook

A **hook** is an event handler that executes automatically in response to Claude Code events. Hooks can respond to
events like tool usage, permission requests, prompt submissions, and session lifecycle events. They enable automation,
validation, and custom workflows triggered by specific actions.

### MCP Server

An **MCP (Model Context Protocol) Server** is an external service that provides Claude with access to specialized tools,
documentation, and capabilities. MCP servers extend what Claude can do by connecting it to external resources like
documentation databases, APIs, browser automation, and other integrations. They start automatically when the plugin is
enabled.

## Installation

```
/plugin marketplace add martinellich/aiup-marketplace
/plugin enable martinellich/aiup-marketplace
/plugin enable aiup-vaadin-jooq
```

## Available Plugins

### aiup-vaadin-jooq

A plugin for Java web application development using the Vaadin + jOOQ technology stack.

#### Commands

The AIUP workflow commands are numbered to indicate their recommended execution order:

| Command                 | Description                                  |
|-------------------------|----------------------------------------------|
| `/1_requirements`       | Generate requirements from vision document   |
| `/2_entity_model`       | Create entity model with Mermaid ER diagrams |
| `/3_use_case_diagram`   | Generate PlantUML use case diagrams          |
| `/4_database_migration` | Create Flyway database migrations            |
| `/5_use_case_spec`      | Write detailed use case specifications       |
| `/6_implement`          | Implement use cases using Vaadin and jOOQ    |
| `/7_karibu_test`        | Create Karibu unit tests                     |
| `/8_playwright_test`    | Create Playwright integration tests          |

#### Skills

| Skill                             | Description                                                                  |
|-----------------------------------|------------------------------------------------------------------------------|
| **requirements-engineer**         | Creates requirements catalogs                                                |
| **data-modeler**                  | Creates entity models with Mermaid.js ER diagrams and attribute tables       |
| **use-case-specification-writer** | Creates use case specifications with structured scenarios and business rules |
| **karibu-tester**                 | Creates Karibu unit tests for Vaadin views                                   |
| **playwright-tester**             | Creates Playwright integration tests for Vaadin views                        |

#### MCP Servers

| Server            | Description                            |
|-------------------|----------------------------------------|
| **Vaadin**        | Access to Vaadin documentation         |
| **KaribuTesting** | Karibu testing framework documentation |
| **jOOQ**          | jOOQ documentation                     |
| **context7**      | General library documentation lookup   |
| **Playwright**    | Browser automation for testing         |

## Learn More

Visit [aiup.dev](https://aiup.dev) to learn more about the AI Unified Process methodology.
