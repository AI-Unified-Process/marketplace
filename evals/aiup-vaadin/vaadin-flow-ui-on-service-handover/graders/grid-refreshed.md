---
criterion: "Success message verbatim"
type: regex
weight: 4
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*(refreshAll\(\)|refreshItem\()).*guest/ui/\w+\.java'
---
