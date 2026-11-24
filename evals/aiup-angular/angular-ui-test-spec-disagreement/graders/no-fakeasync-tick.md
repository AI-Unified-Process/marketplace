---
criterion: "No zone.js helpers in a zoneless project"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*register-guest/[\w.-]*\.spec\.ts).*(fakeAsync\(|\btick\()'
match: not_contains
---
