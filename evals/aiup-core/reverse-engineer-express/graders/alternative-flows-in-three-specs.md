---
criterion: "Alternative flows present"
type: regex
weight: 4
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?docs/use_cases/(UC-\d{3})-[^\n]*?### A\d+[^\n]*?\*\*Trigger:\*\*(?:(?!\\n).)*?[Ss]teps?\s*\d[\s\S]*?"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?docs/use_cases/(?!\2-)(UC-\d{3})-[^\n]*?### A\d+[^\n]*?\*\*Trigger:\*\*(?:(?!\\n).)*?[Ss]teps?\s*\d[\s\S]*?"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?docs/use_cases/(?!\2-|\4-)UC-\d{3}-[^\n]*?### A\d+[^\n]*?\*\*Trigger:\*\*(?:(?!\\n).)*?[Ss]teps?\s*\d'
---
