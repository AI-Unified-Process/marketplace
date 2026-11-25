---
criterion: "Handover block"
type: regex
weight: 2
target: { source: file, path: "session-log.md" }
pattern: '\w+Service\.\w+\([^)\n]*\)\s*:?\s*\w+'
---
