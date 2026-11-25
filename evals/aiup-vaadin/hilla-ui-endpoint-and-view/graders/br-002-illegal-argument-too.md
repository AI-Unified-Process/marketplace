---
criterion: "Errors reach the browser with their message"
type: regex
weight: 2
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*@BrowserCallable\b)(?=.*catch\s*\(\s*(final\s+)?([\w.]+\s*\|\s*)*IllegalArgumentException\b).*com/example/hotel/guest/\w+\.java'
---
