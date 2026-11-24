---
criterion: "A2 rejection reaches the caller"
type: regex
weight: 9
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?UC001RegisterGuestApiTest\.java(?=.*(isConflict\(\)|\b409\b|HttpStatus\.CONFLICT)).*Guests must be at least 18 years old on the day of arrival\.'
---
