---
criterion: "Duplicate key race translated"
type: regex
weight: 4
target: trace
pattern: '("name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?guest/\w+Service\.java.*catch\s*\([^)]*(DuplicateKeyException|DataIntegrityViolationException)[^)]*\).{0,400}?throw\s+new\s+\w*Email\w*Exception|"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{[^\n]{0,80}session-log\.md[^\n]*?(DuplicateKeyException|DataIntegrityViolationException))'
---
