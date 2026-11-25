---
criterion: "Invalid input as Problem Details"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?UC001RegisterGuestApiTest\.java.*(isBadRequest\(\)|\b400\b|HttpStatus\.BAD_REQUEST)'
---
