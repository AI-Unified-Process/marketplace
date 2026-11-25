---
criterion: "No production or docs changes"
type: regex
weight: 2
target: trace
pattern: '("name":\s*"(Write|Edit|MultiEdit|NotebookEdit)",\s*"input":\s*\{\s*"(file_path|notebook_path)":\s*"[^"]*(UC002ListGuestsApiTest|TestcontainersConfiguration|usecase/UseCase)\.java|"name":\s*"Bash",\s*"input":\s*\{[^\n]*?(>>?|\btee\s+(-a\s+)?|\bsed\s+-i\S*\s[^\n]*?|\bmv\s+\S+\s+|\bcp\s+\S+\s+|\brm\s+(-\w+\s+)*)\s*\S*(UC002ListGuestsApiTest|TestcontainersConfiguration|usecase/UseCase)\.java)'
match: not_contains
---
