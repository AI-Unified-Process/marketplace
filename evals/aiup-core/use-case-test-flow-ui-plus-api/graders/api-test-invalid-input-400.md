---
criterion: "API tests for the contract"
type: regex
weight: 2
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?UC002RegisterForWorkshopApiTest\.java.*(\b400\b|BAD_REQUEST|isBadRequest)'
---
