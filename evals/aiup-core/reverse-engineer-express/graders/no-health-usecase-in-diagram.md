---
criterion: "No /health use case"
type: regex
weight: 5
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?docs/use_cases\.puml.*\busecase\s+(\w+\s+as\s+)?(\\"|\()[^)"]{0,80}?([Hh]ealth|[Hh]eartbeat|[Ll]iveness)'
match: not_contains
---
