---
criterion: "Service enforces the rules"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*@Service)(?=.*@Transactional)(?=.*UC-002)[^\n]*?Service\.java'
---
