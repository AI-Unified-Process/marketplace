---
criterion: "API tests for the contract"
type: regex
weight: 1
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?UC002RegisterForWorkshopApiTest\.java.*@UseCase\(\s*id\s*=\s*\\"UC-002\\"'
---
