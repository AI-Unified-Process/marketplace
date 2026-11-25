---
criterion: "API does not repeat the rule boundaries"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?UC002RegisterForWorkshopApiTest\.java.*businessRules\s*=\s*\{[^}]*BR-003[^}]*\}.*businessRules\s*=\s*\{[^}]*BR-003'
match: not_contains
---
