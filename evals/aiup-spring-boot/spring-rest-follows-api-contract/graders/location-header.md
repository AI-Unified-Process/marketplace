---
criterion: "Response property names from the contract"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?Controller\.java.*(ResponseEntity\s*\.\s*created\(|\.location\(|HttpHeaders\.LOCATION)'
---
