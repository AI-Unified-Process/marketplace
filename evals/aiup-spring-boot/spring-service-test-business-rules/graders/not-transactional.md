---
criterion: "No @Transactional test, targeted cleanup"
type: regex
weight: 4
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?UC001RegisterGuestServiceTest\.java.*\\n\s*@Transactional\b'
match: not_contains
---
