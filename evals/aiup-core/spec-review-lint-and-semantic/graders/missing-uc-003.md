---
criterion: "Missing specification reported"
type: regex
weight: 8
target: { source: file, path: "session-log.md" }
pattern: 'UC-003[^\n]*(missing|no spec|without (a )?spec)|(missing|no spec|without (a )?spec)[^\n]*UC-003'
flags: i
---
