---
criterion: "Enums stored as text"
type: regex
weight: 2.5
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*enum \w*Status\b).*Domain/[\w./-]*\.cs'
---
