---
criterion: "No zone.js helpers in a zoneless project"
type: regex
weight: 2
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*(detectChanges\(\)|whenStable\(\))).*register-guest/[\w.-]*\.spec\.ts'
---
