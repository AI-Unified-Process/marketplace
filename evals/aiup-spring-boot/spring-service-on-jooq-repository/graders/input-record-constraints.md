---
criterion: "Bean Validation on the input"
type: regex
weight: 2
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?guest/\w+\.java.*(?=.*\brecord\s+\w+\s*\()(?=.*@NotBlank\b)(?=.*@NotNull\b)'
---
