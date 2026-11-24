---
criterion: "Reports expected failure and hands off"
type: regex
weight: 2
target: { source: file, path: "session-log.md" }
pattern: '(?=[\s\S]*Guest saved)(?=[\s\S]*Guest registered)[\s\S]*[Ss]tep 2'
---
