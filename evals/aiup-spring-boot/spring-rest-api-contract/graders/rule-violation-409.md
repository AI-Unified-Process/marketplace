---
criterion: "Status per alternative flow"
type: regex
weight: 5
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*(@RestControllerAdvice|(Advice|Handler)\.java))(?=.*(BusinessRuleException|EmailAlreadyRegisteredException|GuestTooYoungException))[^\n]*?(HttpStatus\.(CONFLICT|UNPROCESSABLE_(ENTITY|CONTENT))|\b(409|422)\b)'
---
