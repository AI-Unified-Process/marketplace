---
criterion: "Test data handling"
type: regex
weight: 2
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?UC001RegisterGuestApiTest\.java.*(insert\s+into\s+guest|INSERT\s+INTO\s+guest|\.insertInto\(|[Rr]epository\.(save|insert|register)\w*\()'
match: not_contains
---
