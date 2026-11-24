---
criterion: "Mock data uses generated field names"
type: regex
weight: 2
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?UC-020-[\w-]+\.test\.tsx.*\b(firstName|lastName|email)\s*:\s*(\\"|\x27|`)(Anna|Berger|anna\.berger@example\.com|Luca|Rossi|luca\.rossi@example\.com|Mia|Weber|mia\.weber@example\.com)\b'
---
