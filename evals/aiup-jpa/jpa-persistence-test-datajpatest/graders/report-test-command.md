---
criterion: "Markers rows and hand-off"
type: regex
weight: 1
target: { source: file, path: "session-log.md" }
pattern: 'mvnw?[^\n]{0,120}(test|verify)'
---
