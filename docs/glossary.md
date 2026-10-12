<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# Glossary

| Term                   | Definition                                                                                                                         | Avoid         |
|------------------------|------------------------------------------------------------------------------------------------------------------------------------|---------------|
| Business Analyst       | The role that writes the requirements catalog, the entity model, the use cases, and the business processes.                        |               |
| Developer              | The role that creates migrations, implements use cases, and writes their unit and component tests.                                 |               |
| Tester                 | The role that writes test cases, automates them as journey tests, and audits coverage.                                             |               |
| Coding Agent           | The AI tool that runs the skills in the project, such as Claude Code, Codex, Cursor, or Copilot.                                   | AI assistant  |
| Skill                  | One workflow step packaged as an Agent Skill and started as a slash command.                                                       | Command       |
| Core Plugin            | The stack-agnostic plugin `aiup-core` with the analysis and review skills.                                                         |               |
| Stack Plugin           | A plugin with the migration, implementation, and test skills for one technology stack.                                             |               |
| Vision                 | The prose document that states mission, target users, goals, and scope; it carries no ids.                                         |               |
| Requirements Catalog   | The document with all functional requirements, non-functional requirements, and constraints.                                       |               |
| Requirement            | A functional requirement (FR), non-functional requirement (NFR), or constraint (C) in the requirements catalog.                    |               |
| Entity Model           | The domain entities with their attributes, relationships, and validation rules, drawn as an ER diagram.                            | Data model    |
| Use Case               | A user goal of one primary actor, reached in one sitting, with a UC id.                                                            |               |
| Use Case Diagram       | The PlantUML diagram that maps the actors to the use cases of the system.                                                          |               |
| Use Case Specification | The document that describes one use case with its scenarios, alternative flows, and business rules.                                |               |
| Business Rule          | A rule a use case enforces, numbered per use case and cited elsewhere as `UC-XXX BR-YYY`.                                          |               |
| Business Process       | A BPMN model with a BP id that connects use cases of several roles through hand-overs, decisions, and waiting points.              | Workflow      |
| Test Case              | An end-to-end journey with a TC id that chains several use cases, with concrete test data and validations.                         | Test scenario |
| Journey Test           | The automated browser test that executes one test case.                                                                            |               |
| Specification          | Any of the reviewed artifacts in `docs/`: requirements catalog, glossary, entity model, use cases, business processes, test cases. |               |
| Finding                | One problem reported by the specification lint, the semantic review, or the coverage audit, with a severity.                       |               |
| Baseline               | The accepted lint findings of an existing specification that are no longer reported.                                               |               |
| Traceability Matrix    | The table from requirement to use case, business rule, and test case, computed from the specifications.                            |               |
| Coverage Audit         | The check of one use case or test case against the code and tests that realize it; not line coverage.                              | Code coverage |
| Marker                 | An id in code or in a test name that links it to a use case, business rule, or test case.                                          |               |
