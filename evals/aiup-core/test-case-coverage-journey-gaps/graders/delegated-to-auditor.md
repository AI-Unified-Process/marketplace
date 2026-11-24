---
criterion: "Delegated to the auditor"
type: regex
weight: 7
target: trace
pattern: '"name":\s*"(?:Task|Agent)",\s*"input":\s*\{[^\n]*?uc-coverage-layered|"name":\s*"Read",\s*"input":\s*\{\s*"file_path":\s*"[^"]*uc-coverage-layered\.md"'
---
