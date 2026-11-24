---
criterion: "Documented statuses"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*(@RestControllerAdvice|(Advice|Handler)\.java))(?=.*(ConstraintViolationException|MethodArgumentNotValidException|ResponseEntityExceptionHandler))[^\n]*?(HttpStatus\.BAD_REQUEST|\b400\b)'
---
