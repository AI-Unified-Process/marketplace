---
criterion: "HttpTestingController with verify"
type: regex
weight: 2
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*register-guest/[\w.-]*\.spec\.ts).*(from\s*(\\"|''|`)msw|setupServer\(|provide:\s*GuestService)'
match: not_contains
---
