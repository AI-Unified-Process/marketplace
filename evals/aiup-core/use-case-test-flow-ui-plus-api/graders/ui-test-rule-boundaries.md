---
criterion: "UI tests cover the whole use case"
type: regex
weight: 4
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?UC002RegisterForWorkshopTest\.java(?=.*businessRules\s*=\s*\{[^}]*BR-001[^}]*\}.*businessRules\s*=\s*\{[^}]*BR-001)(?=.*businessRules\s*=\s*\{[^}]*BR-002[^}]*\}.*businessRules\s*=\s*\{[^}]*BR-002).*businessRules\s*=\s*\{[^}]*BR-003[^}]*\}.*businessRules\s*=\s*\{[^}]*BR-003'
---
