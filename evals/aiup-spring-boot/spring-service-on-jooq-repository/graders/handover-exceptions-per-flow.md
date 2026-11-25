---
criterion: "Handover block"
type: regex
weight: 2
target: { source: file, path: "session-log.md" }
pattern: 'EmailAlreadyRegisteredException[^\n]*A1|A1[^\n]*EmailAlreadyRegisteredException'
---
