---
criterion: "Service with the rules and the transaction"
type: regex
weight: 2
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?[^\"]*Service\.java.*(DuplicateKeyException|DataIntegrityViolationException)'
---
