---
criterion: "Controller with an error mapping per flow"
type: regex
weight: 2
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*@RestControllerAdvice)(?=.*ProblemDetail)(?=.*(CONFLICT|409)).*src/main/java/'
---
