---
criterion: "BR-003 boundary cases"
type: regex
weight: 5
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?UC001RegisterGuestServiceTest\.java.*(minusYears|plusYears)\(\s*18\s*\)(?!\s*(\\n|\s)*\.(plus|minus)Days)'
---
