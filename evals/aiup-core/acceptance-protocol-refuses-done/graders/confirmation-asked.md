---
criterion: "Confirmation asked, no status set"
type: regex
weight: 15
target: { source: file, path: "session-log.md" }
pattern: '\b(confirm|shall I|should I|may I|do you want)'
flags: i
---
