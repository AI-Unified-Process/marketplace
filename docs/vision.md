<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# Vision: AI Unified Process Marketplace

This is the marketplace's own vision. The AI Unified Process specifies itself with its own skills; the artifacts
next to this file (`requirements.md`, `glossary.md`, `use_cases.puml`, `processes/`) are produced by `aiup-core`.

## Mission

AI-assisted development often jumps from a vague prompt straight to code. Product intent then lives only in a chat
history, and nobody can tell which requirement a piece of code realizes or whether it is tested. The AI Unified
Process Marketplace puts reviewed, versioned specifications between intent and code: requirements with stable ids,
an entity model, use cases, business processes, and test cases, from which a coding agent implements and tests the
software, traceable in both directions.

## Target users

- Business analysts who turn a product vision into requirements, use cases, business processes, and test cases
  without writing code.
- Developers who implement and test use cases with a coding agent in one of the supported technology stacks.
- Testers who derive end-to-end test cases from the business processes and automate them as browser tests.
- Teams with an existing system that has no specification and that want to recover one before changing it.

## Goals

- A team gets from a vision to a reviewed, approved use case specification within one working day.
- Every line of generated code and every generated test traces to a use case and a requirement.
- The specifications can be checked against each other automatically, so a broken reference is found before
  construction starts.
- The same skills work in every coding agent that supports Agent Skills, not only in Claude Code.

## Scope

### In scope

- Stack-agnostic analysis: requirements catalog, glossary, entity model, use case diagram, use case
  specifications, BPMN business processes, and end-to-end test cases.
- Review of the specifications against each other, a traceability matrix, and an HTML report.
- Recovering specifications from an existing code base.
- Stack-specific construction for Vaadin/jOOQ, Angular/JPA, Blazor/.NET, and NestJS/Next.js: database migrations,
  implementation, unit and component tests, browser tests, and a coverage audit of code against specification.
- Distribution as Agent Plugins and Agent Skills through the Claude Code marketplace, the Tessl registry, and manual
  installation.

### Out of scope

- A graphical modeling tool; models are plain text and open in existing tools (PlantUML, bpmn.io).
- Project management: planning, estimation, and tracking of work items.
- Deployment and operation of the generated application.
- Supplementary specifications as a separate artifact.
- Running the skills unattended in a CI pipeline, and the maintenance and release of the plugins themselves.

## Constraints

- Artifacts are plain text (Markdown, PlantUML, Mermaid, BPMN 2.0 XML) committed with the source code.
- Bundled scripts use the Python standard library only.
- Skills follow the Agent Skills specification; plugins follow the Agent Plugins specification.
- Licensed under Apache 2.0.

## Success measures

- Teams review every use case with `/spec-review` before it moves to Approved.
- Every plugin publishes to the Tessl registry without a rejected skill.
- Users run the workflow in at least three different coding agents.
