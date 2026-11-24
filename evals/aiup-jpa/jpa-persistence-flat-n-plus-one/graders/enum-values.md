---
criterion: "Status as a string enum"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?src/main/java/[^"]*\.java.*enum \w+\s*\{[^}]*\bCONFIRMED\b[^}]*\bCHECKED_IN\b[^}]*\bCANCELLED\b'
---
