---
criterion: "Port with domain records only"
type: regex
weight: 2
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?booking/PaymentProviderClient\.java.*\b\w+\s+charge\w*\s*\(\s*(final\s+)?\w+\s+\w+'
---
