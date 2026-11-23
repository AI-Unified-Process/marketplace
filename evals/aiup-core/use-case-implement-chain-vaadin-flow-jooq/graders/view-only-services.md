---
criterion: "Vaadin Flow view on the service"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?[^\"]*View\.java.*(Repository\b|DSLContext|@Transactional|com\.example\.garden\.db\.)'
match: not_contains
---
