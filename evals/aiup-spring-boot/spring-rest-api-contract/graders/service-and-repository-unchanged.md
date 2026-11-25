---
criterion: "Scope respected"
type: regex
weight: 3
target: trace
pattern: '("name":\s*"(Write|Edit|MultiEdit|NotebookEdit)",\s*"input":\s*\{\s*"(file_path|notebook_path)":\s*"[^"]*guest/(GuestService|GuestRepository|BusinessRuleException|EmailAlreadyRegisteredException|GuestTooYoungException|RegisterGuest|Guest)\.java|"name":\s*"Bash",\s*"input":\s*\{[^\n]*?(>>?|\btee\s+(-a\s+)?|\bsed\s+-i\S*\s[^\n]*?|\bmv\s+\S+\s+|\bcp\s+\S+\s+|\brm\s+(-\w+\s+)*)\s*\S*guest/(GuestService|GuestRepository|BusinessRuleException|EmailAlreadyRegisteredException|GuestTooYoungException|RegisterGuest|Guest)\.java)'
match: not_contains
---
