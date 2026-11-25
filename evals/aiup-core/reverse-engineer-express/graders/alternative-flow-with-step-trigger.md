---
criterion: "Alternative flows present"
type: regex
weight: 2
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?docs/use_cases/UC-\d{3}-[^\n]*?### A\d+[^\n]*?\*\*Trigger:\*\*(?:(?!\\n).)*?[Ss]teps?\s*\d'
---
