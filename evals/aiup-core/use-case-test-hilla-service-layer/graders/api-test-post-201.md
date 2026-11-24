---
criterion: "REST tests only for their own contract"
type: regex
weight: 2
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?UC002\w*ApiTest\.java(?=.*/registrations)[^\n]*?(hasStatus\(\s*(HttpStatus\.)?(201|CREATED)|isCreated\(\)|\b201\b)'
---
