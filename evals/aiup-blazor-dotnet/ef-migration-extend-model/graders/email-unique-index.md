---
criterion: "Unique email index and string lengths"
type: regex
weight: 7
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*HasIndex\(\s*\w+\s*=>\s*\w+\.Email\s*\)[^;]*?\.IsUnique\(\)).*Data/[\w./-]*\.cs'
---
