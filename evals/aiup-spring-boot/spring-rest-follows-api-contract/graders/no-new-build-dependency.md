---
criterion: "No generator or springdoc added"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?(pom\.xml|build\.gradle(\.kts)?).*(<dependency>|<plugin>|\bimplementation\s*[(\x27"]|\bid\s*[(\x27"])'
match: not_contains
---
