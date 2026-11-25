---
criterion: "Production untouched, failure reported, hand-off"
type: regex
weight: 1
target: { source: file, path: "session-log.md" }
pattern: 'Next:\s*`?/vaadin-e2e-test UC-020'
---
