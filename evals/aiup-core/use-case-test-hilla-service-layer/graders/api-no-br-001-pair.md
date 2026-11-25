---
criterion: "REST tests only for their own contract"
type: regex
weight: 1
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?UC002\w*ApiTest\.java.*businessRules\s*=\s*\{[^}]*BR-001[^}]*\}.*businessRules\s*=\s*\{[^}]*BR-001'
match: not_contains
---
