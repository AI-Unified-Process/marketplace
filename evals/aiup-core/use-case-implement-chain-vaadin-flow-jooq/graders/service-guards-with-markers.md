---
criterion: "Service with the rules and the transaction"
type: regex
weight: 4
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*@Service)(?=.*@Transactional)(?=.*// UC-001 BR-001:)(?=.*// UC-001 BR-002:).*[^\"]*Service\.java'
---
