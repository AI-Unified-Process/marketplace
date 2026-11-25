---
criterion: "Browserless API used correctly"
type: regex
weight: 2
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?UC020RegisterGuestTest\.java.*\btest\([^;]*\)\s*\.\s*(click|setValue)\('
---
