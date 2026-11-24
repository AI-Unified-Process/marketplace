---
criterion: "Service enforces the rules"
type: regex
weight: 2
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?src/main/java/.*class\s+\w*(FullyBooked|Full|Capacity|Booked)\w*Exception\b'
---
