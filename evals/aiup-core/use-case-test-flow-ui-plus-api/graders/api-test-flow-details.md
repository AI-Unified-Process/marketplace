---
criterion: "API tests for the contract"
type: regex
weight: 4
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?UC002RegisterForWorkshopApiTest\.java(?=.*This workshop is fully booked\.)(?=.*Registration for this workshop has closed\.)(?=.*You are already registered for this workshop\.).*(409|CONFLICT|isConflict)'
---
