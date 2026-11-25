---
criterion: "Validation failures as Problem Details"
type: regex
weight: 4
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*(@RestControllerAdvice|(Advice|Handler)\.java))[^\n]*?(extends\s+ResponseEntityExceptionHandler|MethodArgumentNotValidException)'
---
