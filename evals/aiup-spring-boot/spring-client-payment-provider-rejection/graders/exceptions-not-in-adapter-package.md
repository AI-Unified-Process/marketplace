---
criterion: "Exceptions in the project hierarchy"
type: regex
weight: 2
target: trace
pattern: '("name":\s*"(Write|Edit|MultiEdit|NotebookEdit)",\s*"input":\s*\{\s*"(file_path|notebook_path)":\s*"[^"]*client/paymentprovider/\w*(Declin|Reject|Unavailable)\w*Exception\.java|"name":\s*"Bash",\s*"input":\s*\{[^\n]*?(>>?|\btee\s+(-a\s+)?|\bsed\s+-i\S*\s[^\n]*?|\bmv\s+\S+\s+|\bcp\s+\S+\s+|\brm\s+(-\w+\s+)*)\s*\S*client/paymentprovider/\w*(Declin|Reject|Unavailable)\w*Exception\.java)'
match: not_contains
---
