---
criterion: "Wording findings reported"
type: regex
weight: 2
target: { source: file, path: "session-log.md" }
pattern: '\bitems?\b[^\n]*\b(copy|copies)\b'
flags: i
---
