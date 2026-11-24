---
criterion: "Service class with transaction boundary"
type: regex
weight: 6
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?guest/\w+Service\.java.*@Transactional\b(?!\s*\(\s*readOnly\s*=\s*true)'
---
