---
criterion: "BR-002 validator with marker"
type: regex
weight: 4
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*withValidator\()(?=.*\\"The guest must be at least 18 years old\\").*guest/ui/\w+\.java'
---
