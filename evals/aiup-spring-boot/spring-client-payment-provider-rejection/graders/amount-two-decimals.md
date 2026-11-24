---
criterion: "Adapter in the mapped location follows the contract"
type: regex
weight: 1
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?client/paymentprovider/\w+\.java.*(setScale\(\s*2\b|%\.2f|\\"0\.00\\"|toPlainString\(\))'
---
