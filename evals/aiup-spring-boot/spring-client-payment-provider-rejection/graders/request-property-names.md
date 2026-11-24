---
criterion: "Adapter in the mapped location follows the contract"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?client/paymentprovider/\w+\.java.*(?=.*(String\s+reference\b|\\"reference\\"))(?=.*(String\s+amount\b|\\"amount\\"))(?=.*(String\s+currency\b|\\"currency\\"))(?=.*(String\s+source\b|\\"source\\"))'
---
