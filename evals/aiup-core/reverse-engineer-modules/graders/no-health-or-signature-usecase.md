---
criterion: "No secret values"
type: regex
weight: 2
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?docs/use_cases/[^"\s]*use_cases\.puml.*\busecase\s+(\w+\s+as\s+)?(\\"|\()[^)"]{0,80}?([Hh]ealth|[Ss]ignature)'
match: not_contains
---
