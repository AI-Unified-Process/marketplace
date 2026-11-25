---
criterion: "Fixed clock"
type: regex
weight: 4
target: trace
pattern: '("name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?src/test/\S*?\.java.*Clock\.fixed\(|"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{[^\n]{0,80}session-log\.md[^\n]*?[Cc]lock[^\n]{0,200}?(unnecessary|not needed|no need|does not matter|irrelevant))'
---
