---
criterion: "Specification and status untouched"
type: llm
weight: 2
focus: { source: file, path: "docs/architecture/stack.md" }
---

PASS if the Markers table keeps its All row and has rows for flyway-schema, jooq-persistence, spring-service, vaadin-flow-ui, vaadin-flow-ui-test, and vaadin-e2e-test, and the rest of the file (layers, integration layer, E2E scope, commands) reads like an unchanged AI Unified Process stack file. FAIL if a row is missing, the All row is gone, or a section other than Markers was rewritten.
