---
criterion: "Endpoint only delegates"
type: regex
weight: 4
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*@BrowserCallable\b)(?=.*\(\s*(final\s+)?int\s+\w+\s*,\s*(final\s+)?int\s+\w+\s*\)[^}]*\.list\(\s*[a-z]\w*\s*,\s*[a-z]\w*\s*\)).*com/example/hotel/guest/\w+\.java'
---
