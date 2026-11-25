---
criterion: "BrowserCallable endpoint"
type: regex
weight: 5
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*@BrowserCallable\b)(?=.*\bclass\s+\w+).*com/example/hotel/guest/\w+\.java'
---
