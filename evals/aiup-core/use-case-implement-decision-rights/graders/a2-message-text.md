---
criterion: "A2 message worded by the agent"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?src/main/java/.*(throw new \w*(Closed|Deadline)\w*Exception\(\s*\\"[^\\]{5,}|(Closed|Deadline)\w*Exception\b.*super\(\s*\\"[^\\]{5,}|(Closed|Deadline)\w*Exception\b.*\\"[^\\"]*[Cc]losed)'
---
