---
criterion: "ProblemDetail error mapping"
type: regex
weight: 5
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*(@RestControllerAdvice|(Advice|Handler)\.java)).*(forStatusAndDetail\([^;]*?\.getMessage\(\)|setDetail\(\s*\w+\.getMessage\(\))'
---
