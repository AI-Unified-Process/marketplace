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

## AI Unified Process Workflow

### Vaadin / jOOQ

```
Inception          Elaboration                          Construction
─────────────────  ──────────────────────────────────   ────────────────────────────────────────────────
/requirements  →  /entity-model  →  /use-case-diagram  →  /use-case-spec  →  /flyway-migration
                                                                          ↘  /implement
                                                                          ↘  /browserless-test
                                                                          ↘  /playwright-test
```

### Angular / JPA

For an Angular/JPA project, the inception and elaboration parts look the same, as they are part of the aiup-
core plugin. The construction, however, is optimized for tech stack SpringBoot with JPA and Angular in frontend.
It tests the frontend with Angular vitest unittests, the backend with spring-boot integrations tests and the whole
app with playwright e2e tests. Further it takes existing backend architecture, a hexagonal multi-module Maven 
reactor rather than a single flat module into consideration.

```
Inception          Elaboration                          Construction
─────────────────  ──────────────────────────────────   ────────────────────────────────────────────────
/requirements  →  /entity-model  →  /use-case-diagram  →  /use-case-spec  →  /flyway-migration
                                                                          ↘  /implement
                                                                          ↘  /spring-boot-test
                                                                          ↘  /vitest-test
                                                                          ↘  /playwright-test
```

### C# / Blazor .NET 10

For a C#/Blazor project the inception and elaboration parts are again the aiup-core ones. The construction phase
targets .NET 10 with Blazor and Entity Framework Core, organizing each use case as a Vertical Slice
(`Features/UCXXX_<FeatureName>/`). It tests Blazor components with bUnit, the backend handlers and EF Core code with
xUnit, and the whole app with native C# Playwright tests.

```
Inception          Elaboration                          Construction
─────────────────  ──────────────────────────────────   ────────────────────────────────────────────────
/requirements  →  /entity-model  →  /use-case-diagram  →  /use-case-spec  →  /ef-migration
                                                                          ↘  /implement
                                                                          ↘  /bunit-test
                                                                          ↘  /dotnet-test
                                                                          ↘  /playwright-test
```

### NestJS / Next.js

For a NestJS/Next.js project the inception and elaboration parts are again the aiup-core ones. The construction
phase targets a NestJS backend with Drizzle ORM over PostgreSQL and a Next.js App Router frontend — a split
client/server architecture sharing only a JSON contract. It tests the backend with Vitest unit specs and Supertest
end-to-end specs against a real PostgreSQL in Testcontainers, the frontend with Vitest and React Testing Library,
and the whole app with Playwright. Being the first TypeScript-native stack here, it also encodes two failure modes
the JVM and .NET plugins don't have: ESM/NodeNext `.js` import specifiers, and NestJS decorator metadata silently
vanishing under a Vitest transformer that isn't SWC.

```
Inception          Elaboration                          Construction
─────────────────  ──────────────────────────────────   ────────────────────────────────────────────────
/requirements  →  /entity-model  →  /use-case-diagram  →  /use-case-spec  →  /drizzle-migration
                                                                          ↘  /implement
                                                                          ↘  /nest-test
                                                                          ↘  /react-test
                                                                          ↘  /playwright-test
```

Each skill picks up where the previous one left off using the files produced along the way (`docs/vision.md`,
`docs/requirements.md`, `docs/entity_model.md`, `docs/use_cases.puml`, `docs/use_cases/UC-*.md`,
`docs/test_cases/TC-*.md`). At any point you can
inspect or manually edit these files before continuing.

**Inheriting a legacy codebase?** Start with `/reverse-engineer` — it walks the existing code, configuration, and
schema and produces the same `docs/use_cases.puml`, `docs/use_cases/UC-*.md`, and `docs/entity_model.md` artifacts the
forward workflow would have produced, giving you a documented baseline to work from.

|                         | Inception       | Elaboration                            | Construction                                                                                       | Transition |
|-------------------------|-----------------|----------------------------------------|----------------------------------------------------------------------------------------------------|------------|
| **aiup-core**           | `/requirements` | `/entity-model`<br>`/use-case-diagram` | `/use-case-spec`<br>`/test-case`                                                                   |            |
| **aiup-vaadin-jooq**    |                 |                                        | `/flyway-migration`<br>`/implement`<br>`/implement-hilla`<br>`/browserless-test`<br>`/playwright-test` |            |
| **aiup-angular-jpa**    |                 |                                        | `/flyway-migration`<br>`/implement`<br>`/spring-boot-test`<br>`/vitest-test`<br>`/playwright-test` |            |
| **aiup-blazor-dotnet**  |                 |                                        | `/ef-migration`<br>`/implement`<br>`/bunit-test`<br>`/dotnet-test`<br>`/playwright-test`          |            |
| **aiup-nestjs-nextjs**  |                 |                                        | `/drizzle-migration`<br>`/implement`<br>`/nest-test`<br>`/react-test`<br>`/playwright-test`      |            |

---

## Prerequisites

- [Claude Code](https://claude.ai/code) installed and running in your project
- A `docs/vision.md` file at the root of your project describing the product vision, target users, and high-level
  goals (the `/requirements` skill reads this file to derive your requirements catalog — the richer it is, the better
  the results)
- For the Vaadin/jOOQ plugin: a Maven or Gradle project with Vaadin and jOOQ already on the classpath
- For the Angular/JPA plugin: a Maven or Gradle backend project with Spring Boot, Spring Data JPA, and Flyway
  (flat single module or a hexagonal domain/business/postgres/api/app-style multi-module layout), plus a
  separate Angular (standalone components) frontend project
- For the C#/Blazor .NET 10 plugin: a .NET 10 solution (`.csproj`/`.sln`) using Blazor and Entity Framework Core
- For the NestJS/Next.js plugin: a NestJS backend using Drizzle ORM over PostgreSQL (with `drizzle.config.ts`
  present) and a Next.js App Router frontend — an npm workspace or two separate projects — plus Docker running
  for the Testcontainers-backed e2e tests

## Installation

```
/plugin marketplace add ai-unified-process/marketplace
/plugin install aiup-core
/plugin install aiup-vaadin-jooq        # for a Vaadin + jOOQ project
/plugin install aiup-angular-jpa        # for an Angular + JPA project
/plugin install aiup-blazor-dotnet      # for a C# + Blazor .NET 10 project
/plugin install aiup-nestjs-nextjs      # for a NestJS + Next.js project
```

Install only `aiup-core` if you are using a different tech stack — the methodology skills are stack-agnostic.
Install exactly one stack plugin alongside it, matching your project.

### Verify installation

Start Claude Code in your project and run:

```
/requirements
```

If Claude begins reading `docs/vision.md` and proposing a requirements catalog, the skills are installed correctly.

---

## Using AI Unified Process with other AI coding tools

The AI Unified Process is a methodology, not a Claude-only product. Agent Skills (`SKILL.md`) is now an open standard,
and the same skill folders in this marketplace work natively — with auto-triggering by description — in **OpenAI Codex
CLI**, **Cursor**, **GitHub Copilot**, **Gemini CLI**, and **OpenCode**. Pair them with the
[MCP](https://modelcontextprotocol.io) server configs and the whole workflow runs unchanged.

### Agent Plugins standard

Every plugin directory in this marketplace is also a conformant [**Agent Plugins**](https://agent-plugins.org)
package — the open, vendor-neutral plugin standard (spec v1.0.0) governed by a steering committee with
representatives from Amazon, Cursor, Microsoft, OpenAI, and Vercel. Alongside the Claude Code manifests, each
plugin ships a root-level `plugin.json` (`$schema: https://agent-plugins.org/schemas/1.0.0/plugin.schema.json`)
and `mcp.json`, and the `skills/` layout already follows the [Agent Skills](https://agentskills.io) spec the
standard builds on. Any client that implements Agent Plugins can load a plugin straight from a checkout of this
repository:

```sh
git clone https://github.com/AI-Unified-Process/marketplace.git
# point your Agent Plugins-conformant client at e.g. marketplace/aiup-core/
```

The Agent Plugins manifests are kept in lockstep with the Claude Code and Tessl ones by a CI check
([`scripts/validate-plugin-manifests.sh`](scripts/validate-plugin-manifests.sh)).

### Install via Tessl (any agent)

[Tessl](https://tessl.io) is an agent-agnostic package manager and registry for skills: it installs versioned skills and
wires the MCP servers into the correct per-agent directory for whichever coding agent it detects. All plugins are
published to the Tessl registry as `ai-unified-process/aiup-core`, `ai-unified-process/aiup-vaadin-jooq`, `ai-unified-process/aiup-angular-jpa`,
`ai-unified-process/aiup-blazor-dotnet`, and `ai-unified-process/aiup-nestjs-nextjs`, so
this is the simplest way to adopt
the workflow outside Claude Code — no manual cloning or per-tool MCP translation.

```sh
# one-time: configure your agent(s) — creates a tessl.json manifest at the repo root
tessl init --agent claude-code          # or: cursor, gemini, codex, copilot, copilot-vscode, agents
                                        # (repeat --agent to set up several at once)

# install the plugins from the registry (latest, or pin @version)
tessl install ai-unified-process/aiup-core
tessl install ai-unified-process/aiup-vaadin-jooq     # for a Vaadin + jOOQ project
tessl install ai-unified-process/aiup-angular-jpa     # for an Angular + JPA project
tessl install ai-unified-process/aiup-blazor-dotnet   # for a C# + Blazor .NET 10 project
tessl install ai-unified-process/aiup-nestjs-nextjs   # for a NestJS + Next.js project
```

Installed plugins land in `.tessl/plugins/` and are tracked in `tessl.json`, so versions are pinned and reproducible
across your team. New versions are published automatically on every change by
[`.github/workflows/publish-tessl.yml`](.github/workflows/publish-tessl.yml), so `tessl install` always resolves the
latest release.

**What transfers across agents:**

- **Skills and methodology** — fully portable; every supported agent auto-triggers them by their `description`.
- **MCP servers** — Tessl wires them into any agent that supports MCP. Most `aiup-vaadin-jooq` servers are HTTP (fine on
  the agents listed above); a stdio-only client needs an HTTP↔stdio bridge (see [Caveats](#caveats)).
- **Slash-command routing** — the dispatcher behavior (`/implement` → stack-specific skill) is a Claude Code idiom.
  Other agents read the same Markdown but may not honor `/`-routing identically — invoke skills by intent instead
  (say "implement UC-001" rather than relying on the dispatcher).

### Portability at a glance

| Component                                                  | Portable? | Notes                                                                                  |
|------------------------------------------------------------|-----------|----------------------------------------------------------------------------------------|
| `tessl install ai-unified-process/…`                                     | Yes       | Works on Claude Code, Cursor, Gemini, Codex, and Copilot — installs skills + MCP        |
| Agent Plugins package (`aiup-*/plugin.json` + `mcp.json`)  | Yes       | Each plugin dir conforms to [agent-plugins.org](https://agent-plugins.org) v1.0.0      |
| MCP servers (`aiup-*/.mcp.json`)                           | Yes       | Standard MCP — reformat the config per host                                            |
| `SKILL.md` skill folders (`aiup-*/skills/*/`)              | Yes       | Native support in Codex CLI, Cursor, Copilot, Gemini CLI, and OpenCode                 |
| Auto-triggering by `description`                           | Yes       | All tools above match user intent against the YAML frontmatter `description`           |
| Workflow methodology (vision → requirements → … → tests)   | Yes       | The whole point — tool-agnostic                                                        |
| `/plugin marketplace add …` install                        | Partial   | Works in Claude Code and GitHub Copilot; elsewhere use Tessl or clone this repo        |

### Manual adoption recipe (without Tessl)

Prefer not to use Tessl? You can wire the skills in by hand:

1. `git clone https://github.com/ai-unified-process/marketplace.git` next to your project (or add as a submodule).
2. Make the skill folders visible to your tool — either copy `aiup-core/skills/*/` and `aiup-vaadin-jooq/skills/*/`
   into your tool's skills directory, or symlink them
   (e.g. `ln -s /path/to/marketplace/aiup-core/skills/requirements ~/.codex/skills/requirements`).
3. Configure the MCP servers from `aiup-core/.mcp.json` and `aiup-vaadin-jooq/.mcp.json` in your tool's MCP config file.
4. Trigger skills the same way you would in Claude Code — say "write requirements" or invoke `/requirements`. The tool
   matches your prompt against each skill's `description` and loads the matching `SKILL.md`. File outputs
   (`docs/requirements.md`, `docs/entity_model.md`, `docs/use_cases.puml`, `docs/use_cases/UC-*.md`) are identical
   regardless of tool, so the chain composes even if you mix tools across steps.

### OpenAI Codex CLI

- **Skills**: drop folders into `~/.codex/skills/` (user-global, default `$CODEX_HOME/skills`) or repo-local
  `.agents/skills/`. Codex matches user prompts against each skill's `description` automatically; toggle per skill
  with `allow_implicit_invocation`.
- **MCP**: `~/.codex/config.toml` under `[mcp_servers.<name>]` blocks. Translate `aiup-vaadin-jooq/.mcp.json` like
  this:

```toml
[mcp_servers.Vaadin]
url = "https://mcp.vaadin.com/docs"

[mcp_servers.playwright]
command = "npx"
args = ["@playwright/mcp@latest"]
```

See the [Codex skills docs](https://developers.openai.com/codex/skills) and the
[Codex config reference](https://developers.openai.com/codex/config-reference) for the latest details.

### Cursor

- **Skills**: drop folders into project-local `.cursor/skills/` (Cursor 2.4+). Cursor matches against each skill's
  `description` automatically. Note: there is no global skills directory yet — copy or symlink the marketplace skills
  into each project.
- **MCP**: project-level `.cursor/mcp.json` or global `~/.cursor/mcp.json` — uses `mcpServers` with the same shape
  as Claude's `.mcp.json` (`url` for HTTP servers, `command` / `args` for stdio). Drop in the contents of
  `aiup-vaadin-jooq/.mcp.json` directly.

### GitHub Copilot

- **Plugin marketplace**: Copilot understands Claude Code's marketplace commands directly, so you can install the
  plugins the same way as in Claude Code — no manual skill copying or MCP translation:

  ```
  /plugin marketplace add ai-unified-process/marketplace
  /plugin install aiup-core
  /plugin install aiup-vaadin-jooq        # or: aiup-angular-jpa, aiup-blazor-dotnet, aiup-nestjs-nextjs
  ```

  This pulls in the skills *and* the MCP server configs from each plugin's `.mcp.json`.
- **Skills** (manual alternative): Copilot reads from `.github/skills/`, `.claude/skills/`, and `.agents/skills/` —
  pick one. Available in Copilot for VS Code, Visual Studio 2026, and the cloud agent.
- **MCP** (manual alternative): workspace-level `.vscode/mcp.json` (commit it for your team), or user-level via
  *MCP: Open User Configuration*. Use `"type": "http"` for remote servers and `"command"` / `"args"` for stdio.

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

- **Skills**: drop folders into `.gemini/skills/` (project) or `~/.gemini/skills/` (global). Gemini CLI matches
  prompts against each skill's `description` automatically.
- **MCP**: `~/.gemini/settings.json` `mcpServers` object — same shape as Claude's `.mcp.json`, so it is a near-direct
  copy.

### OpenCode

- **Skills**: drop folders into project-local `.opencode/skills/` or global `~/.config/opencode/skills/`. OpenCode
  also scans `.claude/skills/` and `.agents/skills/` (project and home directory), so skills already installed for
  Claude Code — or via Tessl with `--agent claude-code` or `--agent agents` — are picked up without copying. Skills
  are loaded on demand through OpenCode's built-in `skill` tool, matched against each skill's `description`; access
  can be restricted per skill with `permission.skill` patterns in `opencode.json`.
- **MCP**: `opencode.json` at the project root (or `~/.config/opencode/opencode.json` globally) under the `"mcp"`
  key — use `"type": "remote"` with `url` for HTTP servers and `"type": "local"` with a `command` array for stdio.
  Translate `aiup-vaadin-jooq/.mcp.json` like this:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "Vaadin": { "type": "remote", "url": "https://mcp.vaadin.com/docs" },
    "playwright": { "type": "local", "command": ["npx", "@playwright/mcp@latest"] }
  }
}
```

See the [OpenCode skills docs](https://opencode.ai/docs/skills/) and the
[OpenCode MCP docs](https://opencode.ai/docs/mcp-servers/) for the latest details.

### Caveats

- **Argument passing** (`/use-case-spec UC-001`) works everywhere but the syntax varies — Codex, Gemini CLI,
  and Cursor accept positional arguments after the skill name; in Copilot, pass the ID inline in the chat message
  after invoking the skill; in OpenCode, skills are not slash commands — state the ID in your prompt
  ("specify use case UC-001") and the agent loads the matching skill itself.
- **HTTP MCP servers**: most aiup-vaadin-jooq servers are HTTP. Every tool listed above supports HTTP MCP. If you use
  a client that is stdio-only, you need an HTTP-to-stdio MCP bridge.
- **Cursor has no global skills directory** — copy or symlink the marketplace skills into each project's
  `.cursor/skills/`.
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

### Step 7 — Write Browserless unit tests

```
/browserless-test UC-001
```

Claude generates server-side Vaadin tests using the official **Vaadin Browserless** framework
(`com.vaadin:browserless-test-junit6`) — no browser required. Tests cover navigation, component interactions, form
validation, grid operations, and notifications. Test data is seeded via Flyway migrations under
`src/test/resources/db/migration`; transaction boundaries are preserved (no `@Transactional` on tests).

> Browserless Testing is free and open source under Apache 2.0 since Vaadin 25.1. It is the official successor to UI
> Unit Testing (formerly part of the commercial TestBench) and replaces the community Karibu Testing library as the
> recommended server-side testing approach. The legacy `/karibu-test` skill is still installed for existing projects
> but is **no longer recommended** for new code — use `/browserless-test`.

---

### Step 8 — Write Playwright integration tests

```
/playwright-test UC-001     # use case test — integration tests for one view
/playwright-test TC-001     # test case journey — one end-to-end flow across views
```

Claude generates browser-based tests against the running application (default: `http://localhost:8080`) using
the Drama Finder library for type-safe, accessibility-first element wrappers. Tests are written black-box — they do not
look at the implementation — and never use raw Playwright locators or `Thread.sleep()`.

The skill dispatches on the argument: a `UC-*` ID produces integration tests for a single view derived from the use
case specification, while a `TC-*` ID reads a test case document from `docs/test_cases/TC-*.md` (a user journey
chaining several use cases, created with `/test-case`) and produces one journey test class walking the whole flow. Test classes are named
after the artifact: `UC-001` → `UC001CreateReservationIT`, `TC-001` → `TC001CustomerOnboardingIT`.

---

## Skills Reference

### `/requirements` — Requirements Catalog *(plugin-agnostic)*

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

### `/entity-model` — Entity Model *(plugin-agnostic)*

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

### `/use-case-diagram` — Use Case Diagram *(plugin-agnostic)*

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

### `/use-case-spec` — Use Case Specification *(plugin-agnostic)*

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

### `/test-case` — End-to-End Test Case Document *(plugin-agnostic)*

**Purpose:** Writes an end-to-end test case document (`TC-*.md`) that chains several use cases into one user journey —
the input that `/playwright-test TC-XXX` automates as a journey test.

**Usage:**

```
/test-case UC-001 UC-004     # journey chaining the listed use cases
```

**What it does:**

1. Reads the specification of every listed use case from `docs/use_cases/` (and refuses to chain unspecified ones)
2. Assigns the next free `TC-XXX` ID and names the file after the journey's goal
   (e.g. `docs/test_cases/TC-001-customer-onboarding.md`)
3. Writes the document with a fixed template: Overview (ID, Goal, Priority, Status), Roles, Preconditions (each
   naming its seeded data source), a Flow table (`Step | Name | Description | Test Data | Use Case`), Validation,
   and Postconditions (the data the journey leaves behind — the automated test's cleanup contract)
4. Orders the Flow as the business journey, inserts verification steps between actions, links each action step to its
   use case spec, and uses literal test data values so the document is executable
5. Keeps per-use-case detail out — field-level validations belong to the use case tests; the journey and its end
   state are the subject

**Input:** Use case IDs as arguments  
**Output:** `docs/test_cases/TC-XXX-*.md` (one journey per file)  
**Plugin:** `aiup-core`

---

### `/reverse-engineer` — Reverse Engineer Existing Project *(plugin-agnostic)*

**Purpose:** Recovers AI Unified Process artifacts (use case diagram, per-use-case specifications, entity model) from an existing
codebase so legacy projects can join the AI Unified Process workflow without rewriting documentation by hand.

**Usage:**

```
/reverse-engineer
```

**What it does:**

1. Detects the stack and locates entry points (controllers, routes, view classes), the data layer (ORM models or
   schema migrations), and authentication/authorization configuration
2. Identifies actors from role/authority definitions, authentication boundaries, and external system integrations
3. Groups entry points by user goal — not one use case per HTTP endpoint — and assigns stable IDs (`UC-001`, `UC-002`, …)
4. Writes a PlantUML use case diagram, one specification document per use case, and an entity model with a Mermaid ER
   diagram, all in the exact formats produced by `/use-case-diagram`, `/use-case-spec`, and `/entity-model`
5. Cross-validates that the three documents agree (every actor has a spec, every UC ID has a file, every entity
   referenced in a spec exists in the model)
6. Reports gaps honestly — endpoints it couldn't classify, use cases where the success scenario was hard to recover

**Input:** Existing source tree  
**Output:** `docs/use_cases.puml`, `docs/use_cases/UC-XXX-*.md`, `docs/entity_model.md`  
**Plugin:** `aiup-core`

---

### `/flyway-migration` — Flyway Database Migrations *(in aiup-vaadin-jooq)*

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
6. Does **not** create test classes — use `/browserless-test` and `/playwright-test` for that

**Input:** Use case ID as argument  
**Output:** Vaadin view + jOOQ data access classes  
**Plugin:** `aiup-vaadin-jooq`

---

### `/implement-hilla` — Use Case Implementation (Hilla)

**Purpose:** Implements a use case end-to-end using Hilla — React/TypeScript views with file-based routing — for the
UI layer and jOOQ for the data access layer.

**Usage:**

```
/implement-hilla UC-001
```

**What it does:**

1. Reads the use case specification from `docs/use_cases/` and the entity model from `docs/entity_model.md`
2. Reads existing code first to match conventions before creating new files
3. Implements the data access layer using jOOQ — verifies it compiles before continuing
4. Implements a `@BrowserCallable` service delegating to the data access layer, then the React view as a `.tsx` file
   under `src/main/frontend/views/`, calling the generated type-safe TypeScript client
5. Consults the Vaadin, jOOQ, and JavaDocs MCP servers for current API documentation
6. Does **not** create test classes — use the dedicated testing skills for that

**Input:** Use case ID as argument
**Output:** Hilla React view + `@BrowserCallable` service + jOOQ data access classes
**Plugin:** `aiup-vaadin-jooq`

---

### `/browserless-test` — Vaadin Browserless Server-Side Tests *(recommended, in aiup-vaadin-jooq)*

**Purpose:** Creates server-side unit tests for Vaadin views using the official **Vaadin Browserless** framework
(`com.vaadin:browserless-test-junit6`) — no browser, no WebDriver, no servlet container. Browserless Testing is free
and open source under Apache 2.0 since Vaadin 25.1.

**Usage:**

```
/browserless-test UC-001
```

**What it does:**

1. Reads the use case spec to derive the test scenarios
2. Generates a JUnit 5 test class extending `SpringBrowserlessTest` (annotated `@SpringBootTest`)
3. Uses the `$()` / `$view()` component query API for lookups and the `test()` wrapper for interactions
4. Seeds test data via Flyway migrations under `src/test/resources/db/migration` — never via Mockito, services, or
   `DSLContext`
5. Cleans up only test-created data in `@AfterEach` (does not wipe the schema)
6. Preserves transaction boundaries — tests are not annotated `@Transactional`
7. Reads component state through the component's Java API; reserves `test(...)` for actions

**Input:** Use case ID as argument  
**Output:** Browserless test class under `src/test/java`  
**Plugin:** `aiup-vaadin-jooq`

---

### `/karibu-test` — Karibu Server-Side Tests *(legacy — no longer recommended, in aiup-vaadin-jooq)*

> **Use `/browserless-test` instead for new projects.** Since Vaadin 25.1 the official Browserless Testing framework
> is free and open source under Apache 2.0, making the community Karibu Testing library redundant. This skill is
> retained for existing codebases that already use Karibu.

**Purpose:** Creates Karibu unit tests for Vaadin views — server-side tests that exercise the full Vaadin component
tree without launching a browser.

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

### `/playwright-test` — Playwright Tests *(in aiup-vaadin-jooq)*

**Purpose:** Creates browser-based tests for Vaadin views using Playwright with the Drama Finder library for
type-safe, accessibility-first element wrappers. Covers two test types, dispatched on the argument:

| Input | Artifact | Test type |
|-------|----------|-----------|
| `UC-*` | Use case specification (`docs/use_cases/UC-*.md`) | **Use case test** — integration tests for one view, grouped in `@Nested` classes |
| `TC-*` | Test case document (`docs/test_cases/TC-*.md`) | **Test case journey** — one end-to-end test walking the whole flow across views |

**Usage:**

```
/playwright-test UC-001     # integration tests for one view
/playwright-test TC-001     # end-to-end journey test across views
```

**What it does:**

1. Decides the test type from the argument (`UC-*` vs `TC-*`), then reads the matching document to derive the tests
2. Generates a test extending `AbstractBasePlaywrightIT` (handles browser lifecycle, page creation, and
   Vaadin synchronization automatically)
3. For a use case: covers the main success scenario, alternative flows, and validation rules in `@Nested` classes
4. For a test case journey: implements the whole **Flow** as a single `@Test` method with one private step method per
   flow row, navigating between views through the UI like a user would — one test class per test case
5. Names the test class after the artifact: `UC<id><PascalCaseName>IT` for use cases
   (e.g. `UC-001-create-reservation.md` → `UC001CreateReservationIT`) and `TC<id><PascalCaseName>IT` for test cases
   (e.g. `TC-001-customer-onboarding.md` → `TC001CustomerOnboardingIT`)
6. Writes black-box tests against the running application (default: `http://localhost:8080`) — does not consult the
   implementation
7. Uses Drama Finder element wrappers exclusively — never raw Playwright locators, XPath, `Thread.sleep()`, or
   `page.waitForTimeout()`
8. Reuses existing test data from Flyway migrations; cleans up only test-created data in `@AfterEach`
9. Looks up Drama Finder method signatures via the bundled API reference, falling back to the JavaDocs MCP server

**Input:** Use case ID (`UC-*`) or test case ID (`TC-*`) as argument  
**Output:** Playwright test under `src/test/java` — `UC*IT.java` for use case tests, `TC*IT.java` for journeys  
**Plugin:** `aiup-vaadin-jooq`

---

### `/flyway-migration` — Flyway Database Migrations *(in aiup-angular-jpa)*

**Purpose:** Generates versioned Flyway migration scripts (`V*.sql`) that create the schema described in
`docs/entity_model.md`, using `snake_case` column names so they match Hibernate's default JPA field mapping.
Detects whether the backend is a flat single module or a hexagonal multi-module Maven reactor and places
migrations in the correct location (the persistence-adapter module's `db/migration` directory for a
hexagonal layout).

**Usage:**

```
/flyway-migration
```

**Input:** `docs/entity_model.md`  
**Output:** `backend/src/main/resources/db/migration/V*.sql` (flat) or
`<persistence-adapter-module>/src/main/resources/db/migration/V*.sql` (hexagonal)  
**Plugin:** `aiup-angular-jpa`

---

### `/implement` — Use Case Implementation *(in aiup-angular-jpa)*

**Purpose:** Implements a use case end-to-end across a Spring Boot backend — flat single-module or hexagonal
multi-module (ports and adapters enforced at the Maven-module boundary) — and an Angular frontend.

**Usage:**

```
/implement UC-001
```

**What it does:**

1. Reads the use case specification from `docs/use_cases/` and the entity model from `docs/entity_model.md`
2. Detects the backend's module layout before writing any backend code, and follows whichever asymmetric
   hexagonal conventions the project already established (e.g. outbound-only ports, no inbound use-case
   interface) rather than "fixing" them into textbook full hexagonal
3. Implements the backend per the detected pattern — pure domain record, service, outbound port, DTO, JPA
   adapter, and REST controller for hexagonal; entity/repository/service/controller for flat — verifying
   compilation at each module boundary
4. Implements the frontend: a standalone Angular component using `signal()` state and a hand-written
   `HttpClient` service with a colocated `*.model.ts`
5. Does **not** create test classes — use `/spring-boot-test`, `/vitest-test`, and `/playwright-test` for that

**Input:** Use case ID as argument  
**Output:** Backend classes per detected pattern, plus an Angular page/component  
**Plugin:** `aiup-angular-jpa`

---

### `/spring-boot-test` — Spring Boot Backend Tests *(Angular/JPA)*

**Purpose:** Creates Spring Boot tests for REST controllers and Spring Data JPA repositories, detecting and
following whichever integration-test convention a project already uses — RestAssured + Testcontainers, or
MockMvc — rather than assuming one.

**Usage:**

```
/spring-boot-test UC-001
```

**What it does:**

1. Reads the use case spec to derive the test scenarios
2. Detects the existing test convention; if neither exists yet, defaults to RestAssured + Testcontainers
   (exercises the real HTTP wire format and a real Postgres container, matching the convention this plugin
   was built from)
3. For a hexagonal layout, places integration tests in the composition-root module and any `@DataJpaTest`
   in the persistence-adapter module (the only one with the JPA classpath)
4. Never mocks the repository/service layer with Mockito

**Input:** Use case ID as argument  
**Output:** Spring Boot test class under the composition-root (hexagonal) or `backend/src/test/java` (flat)  
**Plugin:** `aiup-angular-jpa`

---

### `/vitest-test` — Angular Component Tests *(in aiup-angular-jpa)*

**Purpose:** Creates Vitest component tests for Angular views using Angular's own testing idioms — `TestBed`,
`ComponentFixture`, and `HttpTestingController` — rather than porting React Testing Library patterns.

**Usage:**

```
/vitest-test UC-001
```

**What it does:**

1. Reads the use case spec to derive the test scenarios
2. Generates a test file named `UC-XXX-<slug>.spec.ts`, colocated with the component/service, with a
   top-level `describe` block named after the use case
3. Mocks HTTP calls via `provideHttpClientTesting()`/`HttpTestingController`, verified with `httpMock.verify()`
4. Reads state via signal getters and asserts on rendered DOM via native Angular queries

**Input:** Use case ID as argument  
**Output:** Vitest spec file colocated with the component (`frontend/src/**/*.spec.ts`)  
**Plugin:** `aiup-angular-jpa`

---

### `/playwright-test` — Playwright End-to-End Tests *(in aiup-angular-jpa)*

**Purpose:** Creates browser-based end-to-end tests for Angular views using Playwright's native
accessibility-first locators — no wrapper library needed. Since these projects typically have no existing
e2e tooling, the skill checks for a conflicting framework (Cypress, Protractor) before scaffolding Playwright.

**Usage:**

```
/playwright-test UC-001
```

**What it does:**

1. Reads the use case spec to derive the test scenarios
2. Checks for an existing e2e framework before assuming Playwright is unclaimed
3. Generates a test file grouping scenarios in a `test.describe` block per use case, tagged `{ tag: "@UC-XXX" }`
4. Writes black-box tests against the running Angular dev server (default: `http://localhost:4200`) and backend
5. Uses Playwright's own locators exclusively — never CSS selectors, XPath, or `waitForTimeout()`

**Input:** Use case ID as argument  
**Output:** Playwright test file under `frontend/tests/e2e/`  
**Plugin:** `aiup-angular-jpa`

---

### `/ef-migration` — EF Core Database Migrations *(in aiup-blazor-dotnet)*

**Purpose:** Generates native EF Core C# migrations and the entity classes/configurations behind them from
`docs/entity_model.md`.

**Usage:**

```
/ef-migration
```

**What it does:**

1. Reads `docs/entity_model.md` and inspects the existing `DbContext` and entity classes in the solution
2. Writes entity classes with file-scoped namespaces, `required` properties, and nullable-reference-safe
   navigation properties
3. Adds `IEntityTypeConfiguration<T>` Fluent API mappings (table/column names, `HasPrecision`, enum
   `HasConversion<string>()`, foreign keys, unique indexes) and registers them in `OnModelCreating`
4. Runs `dotnet ef migrations add UCXXX_Description` (with `--project` / `--startup-project` flags for
   multi-project solutions) and verifies the generated migration class
5. Never drops production schema and never hardcodes connection strings — those live in `appsettings.json`
   or environment variables

**Input:** `docs/entity_model.md`  
**Output:** Entity classes, `IEntityTypeConfiguration<T>` files, and a migration class under `Migrations/`  
**Plugin:** `aiup-blazor-dotnet`

---

### `/implement` — Use Case Implementation *(in aiup-blazor-dotnet)*

**Purpose:** Implements a use case as a Vertical Slice in a C# / Blazor .NET 10 application.

**Usage:**

```
/implement UC-001
```

**What it does:**

1. Reads the use case spec, `docs/requirements.md` (including UI/UX constraints, styling directives, and
   accessibility NFRs), and `docs/entity_model.md`
2. Creates a feature folder `Features/UCXXX_<FeatureName>/` holding the Blazor page (`.razor`), its code-behind
   (`.razor.cs`), scoped CSS (`.razor.css`), the Command/Query, the Handler, and the Validator
3. Uses modern C# (file-scoped namespaces, primary constructors, `required` properties, collection expressions)
   and picks the right render mode (`InteractiveServer` / `InteractiveAuto`, or static SSR for read-heavy pages)
4. Accesses data through `IDbContextFactory<AppDbContext>` or handler abstractions — never a raw scoped
   `DbContext` in an interactive component — and flows `CancellationToken` through async calls
5. Styles the UI properly: design tokens, typography, hover/loading/empty/error states, responsive layouts, ARIA tags
6. Removes `dotnet new blazor` boilerplate (`Counter.razor`, `Weather.razor`) and registers the new route in
   `NavMenu.razor`
7. Runs `dotnet build` to verify compilation; does **not** create test files — use `/bunit-test`, `/dotnet-test`,
   and `/playwright-test`

**Input:** Use case ID as argument  
**Output:** A vertical slice under `Features/UCXXX_<FeatureName>/` plus navigation wiring  
**Plugin:** `aiup-blazor-dotnet`

---

### `/bunit-test` — bUnit Component Tests *(in aiup-blazor-dotnet)*

**Purpose:** Creates bUnit component tests for Blazor `.razor` pages — full component rendering and interaction
without a browser.

**Usage:**

```
/bunit-test UC-001
```

**What it does:**

1. Locates the Blazor component under test in its feature folder
2. Generates an xUnit test class based on `Bunit.TestContext`, registering mock services via the bUnit DI
   container and setting up authorization (`AddTestAuthorization()`) and JSInterop where the component needs them
3. Renders with `RenderComponent<T>()`, interacts through `cut.Find(...)`, and asserts on markup
4. Handles async lifecycle work (`OnInitializedAsync`, data fetching) with `WaitForState` / `WaitForAssertion`
   instead of arbitrary delays
5. Runs `dotnet test` to confirm the tests pass

**Input:** Use case ID as argument  
**Output:** bUnit test class in the test project  
**Plugin:** `aiup-blazor-dotnet`

---

### `/dotnet-test` — Backend Unit & Integration Tests *(in aiup-blazor-dotnet)*

**Purpose:** Creates xUnit tests for non-UI C# code — EF Core `DbContext` access, vertical slice handlers, and
domain logic.

**Usage:**

```
/dotnet-test UC-001
```

**What it does:**

1. Locates the target handler, repository, or domain service
2. Backs the test with SQLite in-memory (connection held open) or Testcontainers — deliberately **not**
   `UseInMemoryDatabase`, which enforces neither relational constraints nor raw SQL behavior
3. Follows the AAA pattern with a *fresh `DbContext` per phase* — one to seed, a second to act, a third to
   assert — so EF Core change tracking cannot mask bugs
4. Runs `dotnet test` to confirm the tests pass

**Input:** Use case ID as argument  
**Output:** xUnit test class in the test project  
**Plugin:** `aiup-blazor-dotnet`

---

### `/playwright-test` — Native C# Playwright E2E Tests *(in aiup-blazor-dotnet)*

**Purpose:** Creates end-to-end browser tests in native C# using `Microsoft.Playwright.Xunit`, in a dedicated
`*.Tests.E2E` project.

**Usage:**

```
/playwright-test UC-001     # use case journey
/playwright-test TC-001     # test case journey across views
```

**What it does:**

1. Reads `docs/use_cases/UC-XXX-*.md` or `docs/test_cases/TC-XXX-*.md` to derive the journey
2. Generates a test class inheriting from `Microsoft.Playwright.Xunit.PageTest`, hosted by a
   `WebApplicationFactory<Program>`-style fixture on a dynamic port (or a configured base URL)
3. Uses web-first locators (`GetByRole`, `GetByLabel`, `GetByTestId`) with async `Expect(...)` assertions, allowing
   Blazor interactive hydration to complete before interacting
4. Runs `dotnet test` to execute the suite against the application

**Input:** Use case ID (`UC-*`) or test case ID (`TC-*`) as argument  
**Output:** Playwright test class in the `*.Tests.E2E` project  
**Plugin:** `aiup-blazor-dotnet`

---

### `/drizzle-migration` — Drizzle Schema & Migrations *(in aiup-nestjs-nextjs)*

**Purpose:** Turns `docs/entity_model.md` into Drizzle ORM schema definitions and generated PostgreSQL
migrations.

**Usage:**

```
/drizzle-migration
```

**What it does:**

1. Reads `docs/entity_model.md` and locates `drizzle.config.ts` to resolve the project's `schema` and `out` paths
2. Edits the schema file with `pg-core` definitions, mapping entity attributes to column types and turning
   validation rules into CHECK, UNIQUE, and index constraints
3. Detects the project's existing money-column convention (`numeric` returns strings through `pg`,
   `doublePrecision` returns numbers) and follows it rather than imposing one
4. Runs `drizzle-kit generate` and reviews the emitted SQL — migrations are never hand-written, and an
   already-applied migration is never edited
5. Detects a desynchronised migration history (a hand-edited migration with a stale snapshot) and stops to
   report it rather than generating DDL that could drop a populated column

**Input:** `docs/entity_model.md`
**Output:** Updated Drizzle schema plus a generated migration and journal entry under the configured `out` directory
**Plugin:** `aiup-nestjs-nextjs`

---

### `/implement` — Use Case Implementation *(in aiup-nestjs-nextjs)*

**Purpose:** Implements a use case across a NestJS + Drizzle backend and a Next.js App Router frontend.

**Usage:**

```
/implement UC-010
```

**What it does:**

1. Detects the project layout — app roots, ESM/NodeNext, router style, route indirection, shared contract
   package — before writing any code
2. Creates a NestJS feature module (module, controller, service, repository, DTOs) with all SQL confined to the
   repository and a mapped response DTO instead of raw database rows
3. Adds `.js` suffixes to every relative import where the backend is NodeNext, and registers the module in the
   root application module
4. Implements the Next.js page, calling relative `/api/...` paths through the project's rewrite and using its
   existing fetch client, component library, and shared types where present
5. Reconciles an existing implementation with a changed specification instead of creating a parallel one

**Input:** Use case ID as argument, `docs/use_cases/UC-XXX-*.md`, `docs/entity_model.md`
**Output:** NestJS feature module under `src/<feature>/` and a Next.js page under `src/app/<route>/`
**Plugin:** `aiup-nestjs-nextjs`

---

### `/nest-test` — Backend Unit & E2E Tests *(in aiup-nestjs-nextjs)*

**Purpose:** Creates Vitest unit specs and Supertest end-to-end specs that run against a real PostgreSQL
database in Testcontainers.

**Usage:**

```
/nest-test UC-010
```

**What it does:**

1. Verifies `vitest.config.ts` registers `unplugin-swc` — without it NestJS dependency injection silently fails,
   because Vitest's default transformer does not emit decorator metadata — and that `oxc: false` is set on Vite 8+
2. Creates or verifies the Testcontainers global setup: one shared PostgreSQL container per run, with the schema
   dropped and recreated per test file
3. Writes unit specs with repositories stubbed against their real signatures, asserting mapping logic
4. Writes Supertest e2e specs that boot the application in `beforeAll`, covering the main scenario, every
   alternative flow, and each business rule, asserting status codes *and* response bodies
5. Names `describe` blocks `UC-XXX: <Use Case Name>` so tests trace back to the specification

**Input:** Use case ID as argument, `docs/use_cases/UC-XXX-*.md`
**Output:** Unit specs under `src/**/*.spec.ts` and e2e specs under `test/**/*.e2e-spec.ts`
**Plugin:** `aiup-nestjs-nextjs`

---

### `/react-test` — React Component Tests *(in aiup-nestjs-nextjs)*

**Purpose:** Creates Vitest + React Testing Library component tests for Next.js pages in jsdom.

**Usage:**

```
/react-test UC-010
```

**What it does:**

1. Identifies the real target component — where routes delegate to view components, the route file is a thin
   wrapper that asserts nothing
2. Mocks the project's fetch-client module rather than global `fetch`, so the test breaks when the client
   contract changes
3. Queries by role and accessible label, so a page failing the test also fails an accessibility audit
4. Handles shadcn/Radix controls, which render comboboxes rather than native `<select>` elements
5. Falls back to `fireEvent` when `@testing-library/user-event` is not a project dependency, rather than
   importing a package that isn't installed

**Input:** Use case ID as argument, `docs/use_cases/UC-XXX-*.md`
**Output:** Component test file colocated with the component under test
**Plugin:** `aiup-nestjs-nextjs`

---

### `/playwright-test` — Browser E2E Tests *(in aiup-nestjs-nextjs)*

**Purpose:** Creates Playwright end-to-end tests driving the Next.js frontend against a live NestJS API.

**Usage:**

```
/playwright-test UC-010
/playwright-test TC-001     # test case journey across several use cases
```

**What it does:**

1. Reads `docs/test_cases/TC-XXX-*.md` where one covers the request, following its flow table step by step;
   otherwise falls back to the use case's scenarios
2. Configures `webServer` to boot both applications, waiting on a readiness endpoint rather than a bare port
3. Uses accessibility-first locators (`getByRole`, `getByLabel`, `getByText`) and auto-retrying
   `expect(locator)` assertions — never CSS selectors, XPath, or `waitForTimeout()`
4. Reuses the project's existing authenticated `storageState` instead of logging in inside every test
5. Creates test data through the API and removes exactly that data in `test.afterEach`, keeping tests
   parallel-safe when they mutate application-wide state

**Input:** Use case ID (`UC-*`) or test case ID (`TC-*`) as argument
**Output:** Playwright spec under the project's e2e directory
**Plugin:** `aiup-nestjs-nextjs`

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
│   ├── use_cases/                        ← produced by /use-case-spec
│   │   ├── UC-001-create-reservation.md
│   │   ├── UC-002-cancel-reservation.md
│   │   └── ...
│   └── test_cases/                       ← produced by /test-case — journeys for /playwright-test TC-*
│       └── TC-001-book-and-check-in.md
├── src/
│   ├── main/
│   │   ├── java/                         ← produced by /implement
│   │   └── resources/
│   │       └── db/migration/             ← produced by /flyway-migration
│   │           ├── V001__create_room_type_table.sql
│   │           └── ...
│   └── test/
│       ├── java/                         ← produced by /browserless-test, /playwright-test
│       └── resources/
│           └── db/migration/             ← test data seeds
└── CLAUDE.md
```

The tree above shows the Vaadin/jOOQ shape. `aiup-angular-jpa` supports that same flat split *or* a hexagonal multi-module
Maven reactor (`domain`/`business`/`postgres`/`api`/`app`), detected automatically. `aiup-blazor-dotnet` keeps the same
`docs/` tree but organizes code as vertical slices — one `Features/UCXXX_<FeatureName>/` folder per use case holding
the Blazor page, code-behind, scoped CSS, command/query, handler, and validator — with EF Core migrations under
`Migrations/` and tests split across a bUnit/xUnit project and a `*.Tests.E2E` Playwright project.
`aiup-nestjs-nextjs` keeps the same `docs/` tree over a split TypeScript workspace — a NestJS API whose features are
folders of module/controller/service/repository/DTOs with Drizzle migrations under `drizzle/migrations/`, and a
Next.js App Router frontend — with tests split across Vitest unit specs, Supertest e2e specs on Testcontainers,
React Testing Library component tests, and Playwright. See each plugin's
own README for its exact project-structure tree.

---

## Recommended CLAUDE.md

Create a `CLAUDE.md` at your project root. Claude loads this automatically at the start of every session:

```markdown
# Project Context

This project follows the AI Unified Process. Read `docs/vision.md`, `docs/requirements.md`,
and `docs/entity_model.md` for product context before making decisions.

## AI Unified Process Workflow

1. `/requirements`        → derives `docs/requirements.md` from `docs/vision.md`
2. `/entity-model`        → derives `docs/entity_model.md` from requirements
3. `/use-case-diagram`    → produces `docs/use_cases.puml`
4. `/use-case-spec UC-XX` → produces `docs/use_cases/UC-XX-*.md`
5. `/flyway-migration`    → produces `src/main/resources/db/migration/V*.sql`
6. `/implement UC-XX`     → implements the use case (Vaadin + jOOQ)
7. `/browserless-test UC-XX` → server-side unit tests (recommended, free since Vaadin 25.1)
8. `/playwright-test UC-XX` → browser-based integration tests (or `TC-XX` for an end-to-end journey)

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

| Server             | Plugin                                                        | Description                                        |
|--------------------|---------------------------------------------------------------|----------------------------------------------------|
| **context7**       | `aiup-core`                                                   | General library documentation lookup               |
| **Vaadin**         | `aiup-vaadin-jooq`                                            | Vaadin component and framework documentation       |
| **KaribuTesting**  | `aiup-vaadin-jooq`                                            | Karibu testing framework documentation             |
| **jOOQ**           | `aiup-vaadin-jooq`                                            | jOOQ DSL and code generation reference             |
| **JavaDocs**       | `aiup-vaadin-jooq`, `aiup-angular-jpa`                        | Java API documentation lookup                      |
| **MicrosoftLearn** | `aiup-blazor-dotnet`                                          | .NET, Blazor, and EF Core documentation lookup     |
| **bUnitDocs**      | `aiup-blazor-dotnet`                                          | bUnit component testing documentation              |
| **Playwright**     | `aiup-vaadin-jooq`, `aiup-angular-jpa`, `aiup-blazor-dotnet`, `aiup-nestjs-nextjs` | Browser automation for integration tests |
