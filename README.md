# AIUP Marketplace

A collection of plugins that bring the [AI Unified Process](https://aiup.dev) methodology directly into Claude Code.

## What is AIUP?

The AI Unified Process (AIUP) is a methodology that keeps requirements at the center of your development process. It
provides a structured workflow from vision to implementation, ensuring consistency and traceability throughout your
project.

## Installation

```
/plugin marketplace add martinellich/aiup-marketplace
/plugin enable martinellich/aiup-marketplace
```

## Available Plugins

### aiup-vaadin-jooq

A plugin for Java web application development using the Vaadin + jOOQ technology stack.

#### Workflow Commands

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

#### Integrated MCP Servers

- **Vaadin** - Access to Vaadin documentation
- **KaribuTesting** - Karibu testing framework documentation
- **jOOQ** - jOOQ documentation
- **Playwright** - Browser automation for testing

#### Skills

- **data-modeler** - Creates entity models with ER diagrams and attribute tables

## Learn More

Visit [aiup.dev](https://aiup.dev) to learn more about the AI Unified Process methodology.