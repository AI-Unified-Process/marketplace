---
criterion: "No N+1 selects"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?(src/main/java/[^"]*\.java.*FetchType\.EAGER|application\.(properties|ya?ml).*open-in-view\s*[=:]\s*true)'
match: not_contains
---
