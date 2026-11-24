---
criterion: "Undocumented 409 reported as a gap"
type: regex
weight: 5
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{[^\n]*?(open_questions\.md|session-log\.md)[^\n]*?(\b409\b|duplicate_reference)'
---
