---
criterion: "Optimistic locking with @Version"
type: regex
weight: 5
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?/reservation/Reservation\.java.*@Version(\s|\\n)*(@Column\([^)]*\)(\s|\\n)*)?(private |protected )?(int|Integer|long|Long|short|Short) version\b'
---
