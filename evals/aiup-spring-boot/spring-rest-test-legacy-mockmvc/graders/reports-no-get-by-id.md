---
criterion: "Created with Location and JSON contract"
type: regex
weight: 3
target: { source: file, path: "session-log.md" }
pattern: '(Location[^\n]{0,200}(GET|read endpoint|404|no endpoint)|(GET|read endpoint|404)[^\n]{0,200}Location)'
---
