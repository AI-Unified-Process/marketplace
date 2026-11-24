---
criterion: "A1 rejection reaches the caller"
type: regex
weight: 5
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?UC001RegisterGuestApiTest\.java.*The email address .{1,80}? is already registered\.'
---
