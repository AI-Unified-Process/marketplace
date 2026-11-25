---
criterion: "Optimistic locking on the update"
type: regex
weight: 5
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?[^"/]*Order[^"/]*Repository\.java.*(\.execute\(\)\s*(==\s*1|>\s*0|!=\s*0|>=\s*1)|public int \w+\([^)]*\)\s*\{\\n\s*return ctx\s*(\\n\s*)?\.update\()'
---
