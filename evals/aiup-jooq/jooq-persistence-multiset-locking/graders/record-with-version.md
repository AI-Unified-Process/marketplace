---
criterion: "Version in the read record"
type: regex
weight: 11
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?src/main/java/[^"]*\.java.*record (?!\w*Record\()\w+\([^)]*\b(int|Integer|long|Long|short|Short) version\b'
---
