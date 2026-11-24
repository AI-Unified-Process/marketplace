---
criterion: "A1 rejection reaches the caller"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?UC001RegisterGuestApiTest\.java(?=.*is already registered).*(problem\+json|APPLICATION_PROBLEM_JSON)'
---
