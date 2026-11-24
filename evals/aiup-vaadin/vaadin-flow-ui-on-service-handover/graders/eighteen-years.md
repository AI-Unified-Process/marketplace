---
criterion: "BR-002 validator with marker"
type: regex
weight: 2
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*((plusYears|minusYears)\(\s*18L?\s*\)|getYears\(\)\s*>=?\s*18\b|\b18\s*<=?\s*\w+)).*guest/ui/\w+\.java'
---
