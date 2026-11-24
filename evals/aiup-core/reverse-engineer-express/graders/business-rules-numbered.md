---
criterion: "Business rules numbered"
type: regex
weight: 4
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?docs/use_cases/UC-\d{3}-[^\n]*?## Business Rules.*?BR-\d{3}'
---
