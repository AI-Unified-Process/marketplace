---
criterion: "Wording findings reported"
type: regex
weight: 2
target: { source: file, path: "session-log.md" }
pattern: 'customer[^\n]*member'
flags: i
---
