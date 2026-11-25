---
criterion: "DTO records named per contract"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?\brecord\s+GuestResponse\s*\('
---
