---
criterion: "No code or tests"
type: regex
weight: 1
target: trace
pattern: '"name":\s*"Bash",\s*"input":\s*\{"command":\s*"[^\n]*?(>|tee )\s*[^\s"]*\.java\b'
match: not_contains
---
