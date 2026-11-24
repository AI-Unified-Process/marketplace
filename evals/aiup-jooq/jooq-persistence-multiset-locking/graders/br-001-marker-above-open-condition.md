---
criterion: "BR-001 marker"
type: regex
weight: 8
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?[^"/]*Order[^"/]*Repository\.java.*// UC-020 BR-001:[^\\]*\\n\s*[^\\]*PURCHASE_ORDER\.STATUS\.(eq|equal)\(\s*(\\"OPEN\\"|\w+\.OPEN\b)'
---
