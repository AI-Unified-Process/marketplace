---
criterion: "No entity-only field in the type"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*(interface\s+\w+|type\s+\w+\s*=)\s*\{[^}]*imageUrl).*src/[\w./-]*\.tsx?'
---
