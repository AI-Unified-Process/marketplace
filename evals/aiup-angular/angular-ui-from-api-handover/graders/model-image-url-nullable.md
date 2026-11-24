---
criterion: "Model mirrors the DTO field by field"
type: regex
weight: 4
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*(interface\s+\w+|type\s+\w+\s*=)\s*\{[^}]*\bimageUrl\??:\s*(string\s*\|\s*null|null\s*\|\s*string)\b).*src/app/[\w./-]*\.ts'
---
