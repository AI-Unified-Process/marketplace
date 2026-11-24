---
criterion: "Wording findings reported"
type: regex
weight: 4
target: { source: file, path: "session-log.md" }
pattern: 'NFR-001[^\n]*\bfast\b|\bfast\b[^\n]*NFR-001'
flags: i
---
