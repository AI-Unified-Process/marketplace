---
criterion: "Status per alternative flow"
type: regex
weight: 4
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*(@RestControllerAdvice|(Advice|Handler)\.java))(?=.*(ConstraintViolationException|MethodArgumentNotValidException))[^\n]*?(HttpStatus\.BAD_REQUEST|\b400\b)'
---
