---
criterion: "BR-003 boundary cases"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?UC001RegisterGuestServiceTest\.java.*(minusYears\(\s*18\s*\)(\\n|\s)*\.plusDays\(\s*1\s*\)|plusYears\(\s*18\s*\)(\\n|\s)*\.minusDays\(\s*1\s*\))'
---
