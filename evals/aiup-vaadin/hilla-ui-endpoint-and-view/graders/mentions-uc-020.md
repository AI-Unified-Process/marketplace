---
criterion: "BrowserCallable endpoint"
type: regex
weight: 2
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*@BrowserCallable\b)(?=.*UC-020).*com/example/hotel/guest/\w+\.java'
---
