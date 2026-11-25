---
criterion: "Service tests cover the use case"
type: regex
weight: 2
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?UC002\w*ServiceTest\.java.*(Clock\.fixed\(|MutableClock|TestClock|FixedClock|Clock\.offset\()'
---
