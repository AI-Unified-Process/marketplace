<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# Plugin independence

The plugins are open source, so contributors can read and verify the formats
they define. The plugins also define the public interfaces to their skills and
the markers they use for test traceability.
The Studio, the IntelliJ Navigator, and other consumers must stay compatible with
these contracts.

The use case format is defined in
[`format-spec.md`](../../aiup-core/skills/use-case-spec/references/format-spec.md).
The bundled `validate_use_case.py` checks its structural grammar, skill content
rules, and selected canonical conventions using only the Python standard library.
It assigns ERROR to structural violations and WARN to findings from the content
and canonical checks. A change to the grammar, the diagnostic codes, the
diagnostic messages (they are part of the lint baseline fingerprint), or the
exit codes is a contract change. Update `format-spec.md`, the validator, and
its self-test together, and note the change for consumers.

`/spec-review --output <file>` writes semantic findings and verdicts as JSON.

For Java test traceability the layer plugins define one canonical shape for the
`@UseCase` annotation. Each Java layer test skill that uses it ships a copy so it
can create the annotation when it runs first. The repository checks that the
copies agree. [Canonical annotation example](../../aiup-jpa/skills/jpa-persistence-test/references/UseCase.java.md)
and [annotation check](../../scripts/check-usecase-annotation.sh).

## Other contracts

These contracts are described but not yet declared normative.

- The `spec_lint.py` interfaces for [`--format json`](../../aiup-core/skills/spec-review/SKILL.md#ci)
  and [`--next`](next.md)
- [The format of `docs/open_questions.md`](../../aiup-core/skills/open-questions/references/open-questions.md)
- [The format of `docs/architecture/stack.md`](../../aiup-core/skills/stack/references/stack.md)
- The [`@TestCase(id, useCases)` marker](../../aiup-vaadin/skills/vaadin-e2e-test/references/markers.md)

As follow-up work, Studio and `validate_use_case.py` will run against a common
fixture corpus to detect drift.

## Consumers

- The Studio must read and write use case specifications according to the
  published format. It must also follow the documented `UseCaseAttribute`
  convention when linking Blazor tests to specifications and read semantic
  review results in the JSON format described in the
  [Machine-Readable Result section of the skill](../../aiup-core/skills/spec-review/SKILL.md#machine-readable-result).
- The IntelliJ Navigator reads the plugins' `@UseCase` annotation and uses the
  documented Java test class naming conventions to link tests and specifications.
  It must stay compatible with those conventions and the use case format.
- Other consumers must follow the published contract for each format, interface,
  or marker they use.

Generation workflows and their Studio-specific setup remain integration code,
separate from the plugin contracts. See
[generate workflow versioning](../generate-workflow-versioning.md) and
[Werkstatt](../werkstatt.md).
