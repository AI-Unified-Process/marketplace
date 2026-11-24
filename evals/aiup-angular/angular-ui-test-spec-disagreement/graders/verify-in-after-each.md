---
criterion: "HttpTestingController with verify"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*afterEach\([^\n]{0,160}?\.verify\(\)).*register-guest/[\w.-]*\.spec\.ts'
---
