# AI Unified Process Marketplace

A collection of Claude Code plugins that automate the [**AI Unified Process (AIUP)**](https://unifiedprocess.ai) — a
structured workflow for taking a software project from raw vision to fully implemented, tested code, with requirements
at the center at every step.

## What is the AI Unified Process?

AI Unified Process is a disciplined AI-assisted development methodology where every project starts with a written
vision, proceeds
through requirements, an entity model, and use case specifications, and only then enters implementation. Nothing gets
built without a use case. Nothing reaches production without tests traceable to requirements.

This prevents the common failure mode of AI-assisted development: jumping straight to code from a vague prompt,
producing something that half-works and can't be maintained.

The methodology is based on the phases of
the [Rational Unified Process](https://en.wikipedia.org/wiki/Rational_unified_process) — **Inception, Elaboration,
Construction, Transition** — but adapted for AI-driven workflows.

## AIUP Workflow

```
Inception          Elaboration                          Construction
─────────────────  ──────────────────────────────────   ────────────────────────────────────────────────
/requirements  →  /entity-model  →  /use-case-diagram  →  /use-case-spec  →  /flyway-migration
                                                                          ↘  /implement
                                                                          ↘  /karibu-test
                                                                          ↘  /playwright-test
```

Each skill picks up where the previous one left off using the files produced along the way (`docs/vision.md`,
`docs/requirements.md`, `docs/entity_model.md`, `docs/use_cases.puml`, `docs/use_cases/UC-*.md`). At any point you can
inspect or manually edit these files before continuing.

|                      | Inception       | Elaboration                            | Construction                                                                | Transition |
|----------------------|-----------------|----------------------------------------|-----------------------------------------------------------------------------|------------|
| **aiup-core**        | `/requirements` | `/entity-model`<br>`/use-case-diagram` | `/use-case-spec`                                                            |            |
| **aiup-vaadin-jooq** |                 |                                        | `/flyway-migration`<br>`/implement`<br>`/karibu-test`<br>`/playwright-test` |            |

---

## Prerequisites

- [Claude Code](https://claude.ai/code) installed and running in your project
- A `docs/vision.md` file at the root of your project describing the product vision, target users, and high-level
  goals (the `/requirements` skill reads this file to derive your requirements catalog — the richer it is, the better
  the results)
- For the Vaadin/jOOQ plugin: a Maven or Gradle project with Vaadin and jOOQ already on the classpath

## Installation

```
/plugin marketplace add ai-unified-process/marketplace
/plugin install aiup-core
/plugin install aiup-vaadin-jooq
```

Install only `aiup-core` if you are using a different tech stack — the methodology skills are stack-agnostic.

### Verify installation

Start Claude Code in your project and run:

```
/requirements
```

If Claude begins reading `docs/vision.md` and proposing a requirements catalog, the skills are installed correctly.

---

## Using AIUP with other AI coding tools

The AI Unified Process is a methodology, not a Claude-only product. Two of the three pieces this marketplace ships
are portable across any AI coding tool that speaks the [Model Context Protocol](https://modelcontextprotocol.io):

| Component                                        | Portable? | Notes                                                                                |
|--------------------------------------------------|-----------|--------------------------------------------------------------------------------------|
| MCP servers (`aiup-*/.mcp.json`)                 | Yes       | Standard MCP — reformat the config per host                                          |
| Skill prompt bodies (Markdown below `SKILL.md` YAML frontmatter) | Yes       | Plain instructions — usable as a system prompt or `/command` template                |
| Workflow methodology (vision → requirements → entity model → use cases → impl → tests) | Yes       | The whole point — tool-agnostic                                                      |
| Skill auto-triggering (YAML `description`)       | No        | Claude Code-specific behavior                                                        |
| `/plugin marketplace add …` install              | No        | Claude Code-specific — clone this repo instead                                       |

### Generic adoption recipe

1. `git clone https://github.com/ai-unified-process/marketplace.git` next to your project (or add as a submodule).
2. For each step in the workflow, take the body of the matching `SKILL.md` (everything below the `---` frontmatter)
   and register it as a custom prompt or slash command in your tool — see per-tool subsections below.
3. Configure the MCP servers from `aiup-core/.mcp.json` and `aiup-vaadin-jooq/.mcp.json` in your tool's MCP config file.
4. Run the steps manually in order. The file outputs (`docs/requirements.md`, `docs/entity_model.md`,
   `docs/use_cases.puml`, `docs/use_cases/UC-*.md`) are identical regardless of tool, so the chain still composes
   even if you mix tools across steps.

### OpenAI Codex CLI

MCP servers go in `~/.codex/config.toml` under `[mcp_servers.<name>]` blocks. Translate
`aiup-vaadin-jooq/.mcp.json` like this:

```toml
[mcp_servers.Vaadin]
url = "https://mcp.vaadin.com/docs"

[mcp_servers.playwright]
command = "npx"
args = ["@playwright/mcp@latest"]
```

For prompt files and the latest config keys, see the
[Codex config reference](https://developers.openai.com/codex/config-reference).

### GitHub Copilot (VS Code)

- **MCP**: workspace-level `.vscode/mcp.json` (commit it for your team), or user-level via
  *MCP: Open User Configuration*. Use `"type": "http"` for remote servers and `"command"` / `"args"` for stdio.
- **Prompts**: workspace-level `.github/prompts/<name>.prompt.md`. Each file has optional YAML frontmatter
  (`description`, `model`, `tools`) and a Markdown body — paste the body of the matching `SKILL.md` here. Invoke
  with `/<name>` in the chat input.

```jsonc
// .vscode/mcp.json
{
  "servers": {
    "Vaadin": { "type": "http", "url": "https://mcp.vaadin.com/docs" },
    "playwright": { "command": "npx", "args": ["@playwright/mcp@latest"] }
  }
}
```

### Gemini CLI

- **MCP**: `~/.gemini/settings.json` `mcpServers` object — same shape as Claude's `.mcp.json`, so it is a near-direct
  copy.
- **Custom commands**: `<project>/.gemini/commands/<name>.toml` (or `~/.gemini/commands/` for global). The required
  TOML key is `prompt`; subdirectories namespace the command (e.g. `aiup/requirements.toml` → `/aiup:requirements`).

```toml
# .gemini/commands/aiup/requirements.toml
description = "Generate the requirements catalog from docs/vision.md"
prompt = """
<paste the body of aiup-core/skills/requirements/SKILL.md here>
"""
```

### Cursor / Windsurf

- **MCP**: project-level `.cursor/mcp.json` or global `~/.cursor/mcp.json` — uses `mcpServers` with the same shape
  as Claude's `.mcp.json` (`url` for HTTP servers, `command` / `args` for stdio). Drop in the contents of
  `aiup-vaadin-jooq/.mcp.json` directly.
- **Rules / commands**: project-level `.cursor/rules/*.mdc` for always-on or auto-attached instructions; Windsurf
  uses `.windsurfrules`. Both render Markdown bodies, so the SKILL.md content drops in unchanged.

### Caveats

- **Auto-triggering** (e.g. "write requirements" → `/requirements`) only works in Claude Code; on other tools the
  user invokes the prompt by name.
- **Argument passing** (`/use-case-spec UC-001`) works in Codex, Gemini CLI, and Cursor (via templating); for
  Copilot, pass the ID inline in the chat message after invoking the prompt.
- **HTTP MCP servers**: most aiup-vaadin-jooq servers are HTTP. Every tool listed above supports HTTP MCP. If you
  use a client that is stdio-only, you need an HTTP-to-stdio MCP bridge.
- **Methodology stays the same**: the file artifacts (`docs/*.md`, `docs/use_cases/UC-*.md`, Flyway migrations) are
  the contract between steps. As long as a step produces the right file, the next step works regardless of which
  tool ran the previous one.

---

## How to use?

Here is a complete end-to-end example of building a hotel reservation system.

### Step 1 — Generate the requirements catalog

```
/requirements
```

Claude reads `docs/vision.md`, identifies functional requirements (as user stories), non-functional requirements (
measurable quality attributes), and constraints, then writes them into `docs/requirements.md` as three separate tables.
Every requirement gets a stable ID (FR-001, NFR-001, CON-001) and a status. Review the catalog before continuing.

---

### Step 2 — Design the entity model

```
/entity-model
```

Claude reads `docs/requirements.md`, identifies the domain entities and their relationships, then writes
`docs/entity_model.md` with a Mermaid ER diagram and one attribute table per entity (data type, length/precision,
validation rules). Approve the model before moving to use cases.

---

### Step 3 — Draw the use case diagram

```
/use-case-diagram
```

Claude reads `docs/requirements.md`, identifies actors and use cases, then writes a PlantUML diagram at
`docs/use_cases.puml`. Each use case gets a stable ID (UC-001, UC-002, …) that traces back to one or more functional
requirements.

---

### Step 4 — Specify the use cases

```
/use-case-spec UC-001
/use-case-spec UC-001 UC-002 UC-003     # multiple at once
```

Claude writes a detailed specification per use case into `docs/use_cases/` covering actors, preconditions, the main
success scenario as numbered steps, alternative flows for error conditions, postconditions, and business rules. Each
spec is a single document — Claude will not bundle multiple use cases together.

---

### Step 5 — Create the database migrations

```
/flyway-migration
```

Claude reads `docs/entity_model.md` and writes versioned Flyway migrations (`V001__create_*.sql`, `V002__…`) into
`src/main/resources/db/migration`. Primary keys use sequences (no auto-increment), foreign keys and check constraints
are derived from the entity model. Run `mvn flyway:migrate` to apply.

---

### Step 6 — Implement the use case

```
/implement UC-001
```

Claude reads the use case spec, the entity model, and existing code to learn your conventions, then implements the data
access layer with jOOQ and the UI with Vaadin. It compiles after each layer and stops on errors. It does **not** write
tests — those have dedicated skills.

---

### Step 7 — Write Karibu unit tests

```
/karibu-test UC-001
```

Claude generates server-side Vaadin tests using Karibu Testing — no browser required. Tests cover navigation, component
interactions, form validation, grid operations, and notifications. Test data is seeded via Flyway migrations under
`src/test/resources/db/migration`; transaction boundaries are preserved (no `@Transactional` on tests).

---

### Step 8 — Write Playwright integration tests

```
/playwright-test UC-001
```

Claude generates browser-based end-to-end tests against the running application (default: `http://localhost:8080`) using
the Drama Finder library for type-safe, accessibility-first element wrappers. Tests are written black-box — they do not
look at the implementation — and never use raw Playwright locators or `Thread.sleep()`.

---

## Skills Reference

### `/requirements` — Requirements Catalog

**Purpose:** Turns a `docs/vision.md` document into a structured `docs/requirements.md` catalog with functional
requirements, non-functional requirements, and constraints.

**Usage:**

```
/requirements
```

**What it does:**

1. Reads `docs/vision.md` to understand product mission, users, and goals
2. Extracts functional requirements as user stories (`As a [role], I want [goal] so that [benefit]`) with stable IDs (
   FR-001, FR-002, …), priority, and status
3. Extracts non-functional requirements as measurable quality attributes with category (Performance, Security,
   Availability, …), priority, and status
4. Extracts constraints (technical, regulatory, business) with stable IDs (CON-001, CON-002, …)
5. Writes all three as separate tables in `docs/requirements.md` — never mixing requirement types in one table

**Input:** `docs/vision.md`
**Output:** `docs/requirements.md`
**Plugin:** `aiup-core`

---

### `/entity-model` — Entity Model

**Purpose:** Designs the domain entity model with a Mermaid ER diagram and per-entity attribute tables.

**Usage:**

```
/entity-model
```

**What it does:**

1. Reads `docs/requirements.md` to identify the domain entities implied by the user stories
2. Draws a Mermaid `erDiagram` showing entities and their relationships (cardinality, role names) — without listing
   attributes inside the diagram
3. Produces one attribute table per entity with columns for attribute name, description, data type, length/precision,
   and validation rules (Primary Key, Sequence, NOT NULL, UNIQUE, foreign keys, check constraints)
4. Writes the result to `docs/entity_model.md`

**Input:** `docs/requirements.md`
**Output:** `docs/entity_model.md`
**Plugin:** `aiup-core`

---

### `/use-case-diagram` — Use Case Diagram

**Purpose:** Generates a PlantUML use case diagram showing actors, use cases, and their relationships derived from the
requirements catalog.

**Usage:**

```
/use-case-diagram
```

**What it does:**

1. Reads `docs/requirements.md` to identify actors and the use cases they participate in
2. Assigns stable IDs (UC-001, UC-002, …), each tracing to at least one functional requirement
3. Writes a `.puml` file at `docs/use_cases.puml` using `left to right direction` and a `rectangle "System Name"`
   boundary
4. Uses standard PlantUML syntax only — no implementation details in use case names

**Input:** `docs/requirements.md`
**Output:** `docs/use_cases.puml`
**Plugin:** `aiup-core`

---

### `/use-case-spec` — Use Case Specification

**Purpose:** Writes detailed specifications for one or more use cases, each as a separate document under
`docs/use_cases/`.

**Usage:**

```
/use-case-spec UC-001
/use-case-spec UC-001 UC-002 UC-003     # multiple use cases at once
```

**What it does:**

1. Reads `docs/use_cases.puml` and `docs/requirements.md` to scope the use case
2. Writes one document per use case under `docs/use_cases/` using a fixed template covering: Overview (ID, name, primary
   actor, goal, status), Preconditions, Main Success Scenario (numbered steps), Alternative Flows (for error
   conditions), Postconditions, and Business Rules
3. Keeps flow steps free of implementation details
4. Refuses to bundle multiple use cases into a single document

**Input:** Use case ID(s) as argument
**Output:** `docs/use_cases/UC-XXX-*.md` (one file per use case)
**Plugin:** `aiup-core`

---

### `/flyway-migration` — Flyway Database Migrations

**Purpose:** Generates versioned Flyway migration scripts (`V*.sql`) that create the schema described in
`docs/entity_model.md`.

**Usage:**

```
/flyway-migration
```

**What it does:**

1. Reads `docs/entity_model.md` and translates each entity into a `CREATE TABLE` statement
2. Creates a `CREATE SEQUENCE` for every primary key (no auto-increment)
3. Adds NOT NULL, UNIQUE, CHECK, and foreign key constraints from the entity model's validation rules
4. Names files using the Flyway convention `V001__create_<table>_table.sql`, `V002__…`
5. Writes scripts to `src/main/resources/db/migration`
6. Will not drop existing tables without explicit confirmation

**Input:** `docs/entity_model.md`
**Output:** `src/main/resources/db/migration/V*.sql`
**Plugin:** `aiup-vaadin-jooq`

---

### `/implement` — Use Case Implementation

**Purpose:** Implements a use case end-to-end using Vaadin for the UI layer and jOOQ for the data access layer.

**Usage:**

```
/implement UC-001
```

**What it does:**

1. Reads the use case specification from `docs/use_cases/` and the entity model from `docs/entity_model.md`
2. Reads existing code first to match conventions before creating new files
3. Implements the data access layer using jOOQ — verifies it compiles before continuing
4. Implements the Vaadin view, wires it to the data access layer, and verifies the full implementation compiles
5. Consults the Vaadin, jOOQ, and JavaDocs MCP servers for current API documentation
6. Does **not** create test classes — use `/karibu-test` and `/playwright-test` for that

**Input:** Use case ID as argument
**Output:** Vaadin view + jOOQ data access classes
**Plugin:** `aiup-vaadin-jooq`

---

### `/karibu-test` — Karibu Server-Side Tests

**Purpose:** Creates Karibu unit tests for Vaadin views — server-side tests that exercise the full Vaadin component tree
without launching a browser.

**Usage:**

```
/karibu-test UC-001
```

**What it does:**

1. Reads the use case spec to derive the test scenarios
2. Generates a JUnit 5 test class using Karibu helpers (`LocatorJ`, `GridKt`, `NotificationsKt`, `ConfirmDialogKt`)
3. Seeds test data via Flyway migrations under `src/test/resources/db/migration` — never via Mockito, services, or
   `DSLContext`
4. Cleans up only test-created data in `@AfterEach` (does not wipe the schema)
5. Preserves transaction boundaries — tests are not annotated `@Transactional`
6. Uses the KaribuTesting MCP server for documentation and code generation

**Input:** Use case ID as argument
**Output:** Karibu test class under `src/test/java`
**Plugin:** `aiup-vaadin-jooq`

---

### `/playwright-test` — Playwright Integration Tests

**Purpose:** Creates browser-based end-to-end tests for Vaadin views using Playwright with the Drama Finder library for
type-safe, accessibility-first element wrappers.

**Usage:**

```
/playwright-test UC-001
```

**What it does:**

1. Reads the use case spec to derive the test scenarios
2. Generates an integration test extending `AbstractBasePlaywrightIT` (handles browser lifecycle, page creation, and
   Vaadin synchronization automatically)
3. Writes black-box tests against the running application (default: `http://localhost:8080`) — does not consult the
   implementation
4. Uses Drama Finder element wrappers exclusively — never raw Playwright locators, XPath, `Thread.sleep()`, or
   `page.waitForTimeout()`
5. Reuses existing test data from Flyway migrations; cleans up only test-created data in `@AfterEach`
6. Looks up Drama Finder method signatures via the JavaDocs MCP server rather than guessing

**Input:** Use case ID as argument
**Output:** Playwright integration test under `src/test/java` (named `*IT.java`)
**Plugin:** `aiup-vaadin-jooq`

---

## Project Structure

After running the full workflow for a project, your tree will look like this:

```
your-project/
├── docs/
│   ├── vision.md                         ← you maintain this
│   ├── requirements.md                   ← produced by /requirements
│   ├── entity_model.md                   ← produced by /entity-model
│   ├── use_cases.puml                    ← produced by /use-case-diagram
│   └── use_cases/                        ← produced by /use-case-spec
│       ├── UC-001-create-reservation.md
│       ├── UC-002-cancel-reservation.md
│       └── ...
├── src/
│   ├── main/
│   │   ├── java/                         ← produced by /implement
│   │   └── resources/
│   │       └── db/migration/             ← produced by /flyway-migration
│   │           ├── V001__create_room_type_table.sql
│   │           └── ...
│   └── test/
│       ├── java/                         ← produced by /karibu-test, /playwright-test
│       └── resources/
│           └── db/migration/             ← test data seeds
└── CLAUDE.md
```

---

## Recommended CLAUDE.md

Create a `CLAUDE.md` at your project root. Claude loads this automatically at the start of every session:

```markdown
# Project Context

This project follows the AI Unified Process. Read `docs/vision.md`, `docs/requirements.md`,
and `docs/entity_model.md` for product context before making decisions.

## AIUP Workflow

1. `/requirements`        → derives `docs/requirements.md` from `docs/vision.md`
2. `/entity-model`        → derives `docs/entity_model.md` from requirements
3. `/use-case-diagram`    → produces `docs/use_cases.puml`
4. `/use-case-spec UC-XX` → produces `docs/use_cases/UC-XX-*.md`
5. `/flyway-migration`    → produces `src/main/resources/db/migration/V*.sql`
6. `/implement UC-XX`     → implements the use case (Vaadin + jOOQ)
7. `/karibu-test UC-XX`   → server-side unit tests
8. `/playwright-test UC-XX` → browser-based integration tests

Never skip the spec for a use case before implementing it.
Always read the entity model before writing data access code.
```

---

## Recommended `docs/vision.md` Structure

The `/requirements` skill relies heavily on this file. Include at minimum:

```markdown
# Vision: <Product Name>

## Mission

<One paragraph on what this product does and the problem it solves.>

## Target Users

- <Primary user role and what they need from the system>
- <Secondary user roles>

## Goals

- <Measurable business or product goals>

## Scope

- In scope: <high-level capabilities>
- Out of scope: <explicit non-goals>

## Constraints

- <Regulatory, technical, organizational constraints>
```

---

## Tips

**Maintain traceability.** Every entity should map to at least one functional requirement; every use case should trace
to one or more FRs; every test should reference a use case ID. The skills produce stable IDs (FR-001, UC-001, …) — keep
them.

**Edit between steps.** The intermediate documents (`requirements.md`, `entity_model.md`, `use_cases.puml`) are designed
to be reviewed and corrected by hand. Do not skip the review.

**Re-run upstream skills when requirements change.** If a new functional requirement appears, re-run `/entity-model` and
`/use-case-diagram` so the downstream artifacts stay consistent. Re-running is cheap; fixing inconsistencies later is
not.

**Keep `aiup-core` even on non-Vaadin stacks.** The methodology skills are stack-agnostic — only the construction-phase
skills are tied to Vaadin/jOOQ. You can pair `aiup-core` with any implementation toolchain.

**Commit `docs/` to version control.** The vision, requirements, entity model, and use case specs are your project's
institutional memory — they explain *why* the code is the way it is, which is invaluable for onboarding and debugging
months later.

---

## Learn More

Visit [unifiedprocess.ai](https://unifiedprocess.ai) for the full methodology.

## Key Concepts

### Marketplace

A **marketplace** is a curated repository that hosts and distributes multiple Claude Code plugins. It acts as a central
hub where plugins can be discovered, installed, and managed. When you add a marketplace to Claude Code, you gain access
to all the plugins it contains.

### Plugin

A **plugin** is a self-contained extension that adds new capabilities to Claude Code. Each plugin can include skills,
agents, hooks, and MCP servers. Plugins are technology-specific and encapsulate everything needed to work with a
particular tech stack or methodology.

### Skill

A **skill** is a specialized behavior defined in a `SKILL.md` file. Skills can be invoked explicitly as slash commands (
e.g., `/requirements`) or triggered automatically by Claude when it recognizes a matching task. Skills are namespaced by
their plugin (e.g., `aiup-core:requirements`).

### MCP Server

An **MCP (Model Context Protocol) server** is an external service that provides Claude with access to specialized tools
and documentation. The plugins in this marketplace ship with the following servers:

| Server            | Plugin             | Description                                  |
|-------------------|--------------------|----------------------------------------------|
| **context7**      | `aiup-core`        | General library documentation lookup         |
| **Vaadin**        | `aiup-vaadin-jooq` | Vaadin component and framework documentation |
| **KaribuTesting** | `aiup-vaadin-jooq` | Karibu testing framework documentation       |
| **jOOQ**          | `aiup-vaadin-jooq` | jOOQ DSL and code generation reference       |
| **JavaDocs**      | `aiup-vaadin-jooq` | Java API documentation lookup                |
| **Playwright**    | `aiup-vaadin-jooq` | Browser automation for integration tests     |
