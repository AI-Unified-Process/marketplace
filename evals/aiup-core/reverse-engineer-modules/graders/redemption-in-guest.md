---
criterion: "Use case in exactly one module"
type: regex
weight: 1
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?docs/use_cases/guest[a-z-]*/UC-\d{3}-[a-z0-9-]*rede(em|mption)'
---
