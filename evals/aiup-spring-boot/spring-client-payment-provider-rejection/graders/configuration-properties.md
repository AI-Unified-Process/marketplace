---
criterion: "Configuration without credentials in code"
type: regex
weight: 4
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?client/paymentprovider/\w+\.java.*@ConfigurationProperties\(\s*((prefix|value)\s*=\s*)?\\"payment[-.]?provider\\"'
---
