---
criterion: "Repository opens the transaction"
type: regex
weight: 10
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?apps/api/src/(orders|products)/[\w.-]+\.repository\.ts.*\bdb\.transaction\('
---
