---
criterion: "Standalone TestBed setup"
type: regex
weight: 4
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*imports:\s*\[\s*RegisterGuest\b).*register-guest/[\w.-]*\.spec\.ts'
---
