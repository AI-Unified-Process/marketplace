---
criterion: "ProblemDetail error mapping"
type: regex
weight: 6
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*@RestControllerAdvice)(?=.*ProblemDetail).*@ExceptionHandler\(\s*\{?\s*(BusinessRuleException|EmailAlreadyRegisteredException|GuestTooYoungException)\.class'
---
