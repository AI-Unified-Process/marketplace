---
criterion: "201 Created, no Location without a read endpoint"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?Controller\.java.*(ResponseEntity\.created\(|\.location\(|HttpHeaders\.LOCATION|\\"Location\\")'
match: not_contains
---
