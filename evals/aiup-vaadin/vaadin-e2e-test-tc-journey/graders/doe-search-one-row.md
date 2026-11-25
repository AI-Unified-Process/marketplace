---
criterion: "Validation scoped to the journey's rows"
type: regex
weight: 4
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*(getTotalRowCount\(\)[^;]{0,40}(isEqualTo\(\s*1L?\s*\)|isOne\(\)|==\s*1\b)|assertEquals\(\s*1L?\s*,\s*\w+\.getTotalRowCount\(\))).*TC003\w*IT\.java'
---
