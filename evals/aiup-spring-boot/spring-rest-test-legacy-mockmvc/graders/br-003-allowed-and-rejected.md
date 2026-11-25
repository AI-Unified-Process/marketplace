---
criterion: "BR-003 boundary cases tested here"
type: regex
weight: 5
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?UC001RegisterGuestApiTest\.java.*businessRules\s*=\s*\{[^}]*BR-003[^}]*\}.*businessRules\s*=\s*\{[^}]*BR-003'
---
