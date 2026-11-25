---
criterion: "Constraint violation mapped"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*23505)[^\n]*?apps/api/src/guests/guests\.service\.ts.*catch\s*\(\s*\w+[^)]*\).*\bthrow\s+(err|error|e|ex|exc|cause)\s*;'
---
