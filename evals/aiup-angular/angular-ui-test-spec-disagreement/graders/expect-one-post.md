---
criterion: "HttpTestingController with verify"
type: regex
weight: 5
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*HttpTestingController)(?=.*/api/guests)(?=.*expectOne\(([^)]*/api/guests|\s*\w+\s*\)))(?=.*POST).*register-guest/[\w.-]*\.spec\.ts'
---
