---
criterion: "Standalone TestBed setup"
type: regex
weight: 1
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*register-guest/[\w.-]*\.spec\.ts).*declarations:\s*\['
match: not_contains
---
