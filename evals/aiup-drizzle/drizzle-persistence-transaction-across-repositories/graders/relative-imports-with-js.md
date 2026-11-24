---
criterion: "NodeNext imports"
type: regex
weight: 2
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?apps/api/src/orders/[\w.-]+\.ts.*from\s+(''|\\")\.\./database/[\w.-]+\.js(''|\\")'
---
