---
criterion: "Errors reach the browser with their message"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*@BrowserCallable\b)(?=.*new\s+(\w+\.)*EndpointException\(\s*(\w+\.getMessage\(\)|\\"Email already registered\\")).*com/example/hotel/guest/\w+\.java'
---
