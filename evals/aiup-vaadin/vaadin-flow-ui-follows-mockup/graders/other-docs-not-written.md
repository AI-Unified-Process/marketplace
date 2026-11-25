---
criterion: "Specification and mockup left alone"
type: regex
weight: 4
target: trace
pattern: '("name":\s*"(Write|Edit|MultiEdit|NotebookEdit)",\s*"input":\s*\{\s*"(file_path|notebook_path)":\s*"[^"]*docs/(?!use_cases/|mockups/|open_questions\.md|architecture/stack\.md)|"name":\s*"Bash",\s*"input":\s*\{[^\n]*?(>>?|\btee\s+(-a\s+)?|\bsed\s+-i\S*\s[^\n]*?|\bmv\s+\S+\s+|\bcp\s+\S+\s+|\brm\s+(-\w+\s+)*)\s*\S*docs/(?!use_cases/|mockups/|open_questions\.md|architecture/stack\.md))'
match: not_contains
---
