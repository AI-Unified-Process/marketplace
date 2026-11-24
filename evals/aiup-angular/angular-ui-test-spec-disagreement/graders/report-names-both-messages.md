---
criterion: "Disagreement reported, code untouched"
type: regex
weight: 4
target: { source: file, path: "session-log.md" }
pattern: 'Guest registered\.?[\s\S]{0,400}Guest saved|Guest saved\.?[\s\S]{0,400}Guest registered'
---
