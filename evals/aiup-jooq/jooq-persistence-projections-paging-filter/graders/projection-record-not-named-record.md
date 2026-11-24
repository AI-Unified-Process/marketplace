---
criterion: "Records.mapping into a Java record"
type: regex
weight: 2
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?src/main/java/[^"]*\.java.*record (?!\w*Record\()\w+\([^)]*\bname\b[^)]*\bcategory\b[^)]*\bprice\b'
---
