---
criterion: "API does not repeat the rule boundaries"
type: regex
weight: 4
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?UC002RegisterForWorkshopApiTest\.java.*businessRules\s*=\s*\{[^}]*BR-002[^}]*\}.*businessRules\s*=\s*\{[^}]*BR-002'
match: not_contains
---
