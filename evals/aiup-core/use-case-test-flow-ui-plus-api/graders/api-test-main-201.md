---
criterion: "API tests for the contract"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?UC002RegisterForWorkshopApiTest\.java(?=.*/api/workshops/.{0,40}?/registrations)[^\n]*?(hasStatus\(\s*(HttpStatus\.)?(201|CREATED)|isCreated\(\)|\b201\b)'
---
