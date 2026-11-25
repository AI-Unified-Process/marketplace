---
criterion: "Specification's button label"
type: regex
weight: 8
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?guest/ui/\w+\.java.*(new\s+Button\(\s*\\"Register\\"|setText\(\s*\\"Register\\"\s*\))'
---
