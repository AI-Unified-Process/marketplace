---
criterion: "Layers below implemented"
type: regex
weight: 1
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?src/main/java/.*class\s+\w*(Closed|Deadline)\w*Exception\b'
---
