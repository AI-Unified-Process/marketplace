---
criterion: "Route view in the ui package"
type: regex
weight: 2
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*@Route\()(?=.*/\*\*[^/]{0,200}UC-020).*guest/ui/\w+\.java'
---
