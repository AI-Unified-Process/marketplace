<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# Project setup

AI Unified Process keeps product and analysis artifacts in a `docs/` directory committed alongside the implementation. The source
layout depends on the selected stack plugin, but the documentation contract stays the same.

## Documentation tree

```text
your-project/
├── docs/
│   ├── vision.md
│   ├── requirements.md
│   ├── entity_model.md
│   ├── use_cases.puml
│   ├── use_cases/
│   │   ├── UC-001-*.md
│   │   └── ...
│   └── test_cases/
│       ├── TC-001-*.md
│       └── ...
└── agent instruction file
```

`docs/vision.md` is maintained by the team. The other files are initially produced by AI Unified Process skills and then reviewed
like any other project artifact. Commit them so identifiers, decisions, and generated code can be traced together.

Stack-specific source and test trees are documented in the plugin READMEs:

- [Vaadin and jOOQ](../../aiup-vaadin-jooq/)
- [Angular and JPA](../../aiup-angular-jpa/)
- [Blazor and .NET](../../aiup-blazor-dotnet/)
- [NestJS and Next.js](../../aiup-nestjs-nextjs/)

## Product vision

Start with the [vision template](../templates/vision.md). Include the product mission, target users, measurable goals,
scope boundaries, and technical, regulatory, or organizational constraints.

Avoid encoding a complete solution design in the vision. The requirements and entity-model steps should be able to
derive and challenge the design from user goals and constraints.

## Agent instructions

Most coding agents support a repository instruction file. Use the format appropriate to the host and tell the agent to
read the AI Unified Process artifacts before making product or architecture decisions.

For Claude Code, copy the [CLAUDE.md template](../templates/CLAUDE.md) to the project root. For another host, adapt the
same rules to its instruction-file convention. Keep the shared instructions stack-neutral; put stack-specific build,
test, and architecture conventions in the project's existing guidance or link to the selected plugin README.

## Maintenance rules

- Review generated documents between workflow steps.
- Keep requirement, use case, and test case identifiers stable after publication.
- Update downstream artifacts when an upstream decision changes.
- Preserve explicit non-goals and constraints; they prevent regenerated code from silently expanding scope.
- Do not treat generated documentation as disposable build output.
