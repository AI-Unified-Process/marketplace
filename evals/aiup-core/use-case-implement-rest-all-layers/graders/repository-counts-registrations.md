---
criterion: "Persistence"
type: regex
weight: 4
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*REGISTRATION)[^\n]*?Repository\.java.*(fetchCount\(|selectCount\(\)|DSL\.count\(|\bcount\(\))'
---
