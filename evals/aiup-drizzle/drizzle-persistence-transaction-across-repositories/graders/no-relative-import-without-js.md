---
criterion: "NodeNext imports"
type: regex
weight: 4
target: trace
pattern: '"name":\s*"(Write|Edit)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?"file_path":\s*"[^"]*apps/api/src/[^"]*\.ts".*from\s+(''\.{1,2}/[^'']*(?<!\.js)''|\\"\.{1,2}/[^"\\]*(?<!\.js)\\")'
match: not_contains
---
