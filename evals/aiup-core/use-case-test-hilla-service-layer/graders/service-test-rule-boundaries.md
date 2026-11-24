---
criterion: "Service tests cover the use case"
type: regex
weight: 4
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?UC002\w*ServiceTest\.java(?=.*businessRules\s*=\s*\{[^}]*BR-001[^}]*\}.*businessRules\s*=\s*\{[^}]*BR-001)(?=.*businessRules\s*=\s*\{[^}]*BR-002[^}]*\}.*businessRules\s*=\s*\{[^}]*BR-002).*businessRules\s*=\s*\{[^}]*BR-003[^}]*\}.*businessRules\s*=\s*\{[^}]*BR-003'
---
