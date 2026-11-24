---
criterion: "Repository for the aggregate"
type: regex
weight: 7
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*@Repository)(?=.*public (PurchaseOrder|Order)Repository\(\s*(final )?DSLContext \w+\s*\)).*(PurchaseOrder|Order)Repository\.java'
---
