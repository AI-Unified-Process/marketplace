---
criterion: "A2 unavailable mapped for both causes"
type: regex
weight: 4
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?\.java.*\\"The payment service is not available\. Please try again later\.\\"'
---
