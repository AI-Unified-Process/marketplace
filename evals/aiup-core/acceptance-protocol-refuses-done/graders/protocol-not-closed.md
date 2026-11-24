---
criterion: "Protocol left open"
type: regex
weight: 10
target: { source: file, path: "docs/acceptance/release-1.0.md" }
pattern: '\*\*(Closed|Accepted):\*\*'
match: not_contains
---
