---
criterion: "Aggregated use cases"
type: regex
weight: 5
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?docs/use_cases\.puml(.*?\busecase\s+(\w+\s+as\s+)?(\\"|\()){9}'
match: not_contains
---
