---
criterion: "Test data from the use case's test migration"
type: regex
weight: 2
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?UC001RegisterGuestServiceTest\.java.*(insert\s+into\s+guest|\.insertInto\(|[Rr]epository\.(save|insert)\w*\()'
flags: i
match: not_contains
---
