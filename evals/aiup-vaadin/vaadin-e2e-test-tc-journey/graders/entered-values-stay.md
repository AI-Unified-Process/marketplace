---
criterion: "Expected messages from the specification"
type: regex
weight: 2
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*(assertValue\(|hasValue\(|getValue\(\)\s*\)\s*\.(isEqualTo|hasToString)\()).*TC003\w*IT\.java'
---
