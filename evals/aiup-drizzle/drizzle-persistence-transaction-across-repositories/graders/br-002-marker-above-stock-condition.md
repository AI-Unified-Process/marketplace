---
criterion: "BR-002 marker"
type: regex
weight: 8
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?apps/api/src/products/products\.repository\.ts.*// UC-030 BR-002:(?:[^\\]|\\")*\\n[^\\]*(gte\(|stock|>=|\.where\()'
---
