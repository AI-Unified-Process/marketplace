---
criterion: "unplugin-swc in the Vitest config"
type: regex
weight: 6
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?apps/api/package\.json.*unplugin-swc'
---
