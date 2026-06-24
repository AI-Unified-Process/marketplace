# aiup-core

> Stack-agnostic core of the [**AI Unified Process (AIUP)**](https://unifiedprocess.ai) — a structured,
> requirements-first workflow for taking a software project from raw vision to use case specifications.

`aiup-core` is the foundation plugin of the AI Unified Process. It is **technology-independent**: it works with any
language, framework, or stack because it stops at the specification boundary. Implementation and testing are handled by
stack-specific plugins (e.g. [`aiup/aiup-vaadin-jooq`](https://registry.tessl.io/aiup/aiup-vaadin-jooq)) that build on
the artifacts this plugin produces.

## What it does

The plugin automates the analysis phases of the AI Unified Process, adapted from the
[Rational Unified Process](https://en.wikipedia.org/wiki/Rational_unified_process) — **Inception → Elaboration →
Construction**. Every project starts from a written vision and proceeds through requirements, an entity model, and use
case specifications. Nothing gets built without a use case.

This prevents the most common failure mode of AI-assisted development: jumping straight to code from a vague prompt and
producing something that half-works and can't be maintained.

## Skills

Each skill is also available as a slash command. Skills pick up where the previous one left off by reading the files
written along the way, so you can inspect or edit any artifact before continuing.

| Phase        | Skill / command       | Description                                                              |
|--------------|-----------------------|--------------------------------------------------------------------------|
| Inception    | `/requirements`       | Generate a structured requirements catalog (user stories, NFRs, constraints) from `docs/vision.md` |
| Elaboration  | `/entity-model`       | Create an entity model with a Mermaid ER diagram and attribute tables    |
| Elaboration  | `/use-case-diagram`   | Generate a PlantUML use case diagram mapping actors to use cases         |
| Construction | `/use-case-spec`      | Write detailed use case specifications (flows, pre/postconditions, rules)|
| Any          | `/reverse-engineer`   | Recover use case diagram, use case specs, and entity model from existing code |

### Workflow

```
Inception          Elaboration                          Construction
─────────────────  ──────────────────────────────────   ─────────────────
/requirements  →  /entity-model  →  /use-case-diagram  →  /use-case-spec
```

The skills produce and consume a set of artifacts under `docs/`:

- `docs/vision.md` — *input you provide* (product vision, target users, goals)
- `docs/requirements.md`
- `docs/entity_model.md`
- `docs/use_cases.puml`
- `docs/use_cases/UC-*.md`

**Inheriting a legacy codebase?** Start with `/reverse-engineer` — it walks the existing code, configuration, and
schema and produces the same `docs/use_cases.puml`, `docs/use_cases/UC-*.md`, and `docs/entity_model.md` artifacts the
forward workflow would have produced, giving you a documented baseline to work from.

## MCP servers

| Server     | Purpose                                                                 |
|------------|-------------------------------------------------------------------------|
| context7   | Fetches current library/framework documentation on demand during analysis |

## Installation

Install from the Tessl registry:

```
tessl install aiup/aiup-core
```

## Prerequisites

- A `docs/vision.md` file at the root of your project describing the product vision, target users, and high-level
  goals. The `/requirements` skill reads this file to derive your requirements catalog — the richer it is, the better
  the results.

## Next step

Once your use case specifications exist, add a stack-specific plugin to implement and test them — for example
[`aiup/aiup-vaadin-jooq`](https://registry.tessl.io/aiup/aiup-vaadin-jooq) for the Vaadin + jOOQ stack.

## License

Apache-2.0 · © [Simon Martinelli](https://unifiedprocess.ai)
