---
criterion: "API does not repeat the rule boundaries"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?UC002RegisterForWorkshopApiTest\.java.*businessRules\s*=\s*\{[^}]*BR-001[^}]*\}.*businessRules\s*=\s*\{[^}]*BR-001'
match: not_contains
---
