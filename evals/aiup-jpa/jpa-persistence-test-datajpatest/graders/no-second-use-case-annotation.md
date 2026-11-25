---
criterion: "Reuses the existing UseCase annotation"
type: regex
weight: 3
target: trace
pattern: '("name":\s*"Write",\s*"input":\s*\{[^\n]*?"file_path":\s*"(?![^"]*src/test/java/com/example/hotel/usecase/UseCase\.java")[^"]*/UseCase\.java"|"name":\s*"Bash",\s*"input":\s*\{[^\n]*?(>|tee\s+)\s*(?![^\s"]*src/test/java/com/example/hotel/usecase/UseCase\.java)[^\s"]*/UseCase\.java)'
match: not_contains
---
