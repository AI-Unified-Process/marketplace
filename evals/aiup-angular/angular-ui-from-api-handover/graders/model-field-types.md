---
criterion: "Model mirrors the DTO field by field"
type: regex
weight: 6
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*(interface\s+\w+|type\s+\w+\s*=)\s*\{(?=[^}]*\bid:\s*number\b)(?=[^}]*\bname:\s*string\b)(?=[^}]*\bcategory:\s*string\b)(?=[^}]*\bprice:\s*number\b)).*src/app/[\w./-]*\.ts'
---
