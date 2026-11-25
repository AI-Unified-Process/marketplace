---
criterion: "Exceptions in the project hierarchy"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?booking/\w*(Declin|Reject)\w*Exception\.java.*extends\s+(com\.example\.hotel\.)?BusinessRuleException\b'
---
