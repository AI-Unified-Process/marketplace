---
criterion: "Unique email index and string lengths"
type: regex
weight: 4
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*\.Email\)[^;]*?HasMaxLength\(254\)).*Data/[\w./-]*\.cs'
---
