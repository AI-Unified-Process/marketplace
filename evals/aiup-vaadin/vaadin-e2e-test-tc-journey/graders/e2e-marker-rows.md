---
criterion: "Reports expected failure and hands off"
type: regex
weight: 3
target: { source: file, path: "docs/architecture/stack.md" }
pattern: '(?=[\s\S]*\|\s*E2E\s*\|\s*vaadin-e2e-test\s*\|\s*Test\s*\|[^\n]*UC-XXX: )(?=[\s\S]*\|\s*E2E\s*\|\s*vaadin-e2e-test\s*\|\s*Test\s*\|[^\n]*@TestCase)(?=[\s\S]*\|\s*E2E\s*\|\s*vaadin-e2e-test\s*\|\s*Name\s*\|)(?=[\s\S]*\|\s*UI\s*\|\s*vaadin-flow-ui\s*\|\s*Name\s*\|)'
---
