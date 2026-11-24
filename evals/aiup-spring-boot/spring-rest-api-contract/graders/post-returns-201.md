---
criterion: "201 Created, no Location without a read endpoint"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?Controller\.java(?=.*@PostMapping).*(HttpStatus\.CREATED|@ResponseStatus\(\s*(code\s*=\s*|value\s*=\s*)?HttpStatus\.CREATED|status\(\s*201\s*\))'
---
