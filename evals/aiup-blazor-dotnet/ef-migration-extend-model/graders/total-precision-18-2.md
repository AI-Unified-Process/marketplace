---
criterion: "Decimal precision configured"
type: regex
weight: 15
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*\.Total\)[^;]*?(HasPrecision\(18,\s*2\)|HasColumnType\(\\\"(decimal|numeric)\(18,\s*2\)\\\"\))).*Data/[\w./-]*\.cs'
---
