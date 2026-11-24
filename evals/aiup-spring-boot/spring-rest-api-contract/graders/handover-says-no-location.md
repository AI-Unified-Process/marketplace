---
criterion: "201 Created, no Location without a read endpoint"
type: regex
weight: 2
target: { source: file, path: "session-log.md" }
pattern: '(Location[^\n]{0,200}(GET|read endpoint|404|no endpoint)|(GET|read endpoint|404)[^\n]{0,200}Location)'
---
