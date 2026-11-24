---
criterion: ".js suffix on relative imports"
type: regex
weight: 4
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?apps/api/src/guests/guests\.service\.ts.*from\s+(''|\\")\.{1,2}/[\w./-]+\.js(''|\\")'
---
