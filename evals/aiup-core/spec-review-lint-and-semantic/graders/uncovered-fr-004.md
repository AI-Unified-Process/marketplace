---
criterion: "Uncovered requirements reported"
type: regex
weight: 3
target: { source: file, path: "session-log.md" }
pattern: 'FR-004[^\n]*(uncovered|not (referenced|covered|linked|realized)|no use case|unreferenced)|(uncovered|not (referenced|covered|linked)|no use case)[^\n]*FR-004'
flags: i
---
