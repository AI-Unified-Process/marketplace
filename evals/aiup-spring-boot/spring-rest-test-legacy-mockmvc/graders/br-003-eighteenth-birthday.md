---
criterion: "BR-003 boundary cases tested here"
type: regex
weight: 2
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?UC001RegisterGuestApiTest\.java.*(minusYears\(\s*18\s*\)|void \w*(eighteen|18)\w*\()'
---
