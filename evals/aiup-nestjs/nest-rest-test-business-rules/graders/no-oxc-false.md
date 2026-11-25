---
criterion: "Transformer chosen from the Vite version"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?apps/api/vitest[\w.-]*\.[cm]?ts.*oxc\s*:\s*false'
match: not_contains
---
