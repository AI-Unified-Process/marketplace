---
criterion: "Validation items asserted"
type: regex
weight: 5
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*(getByRole\(\s*(\\"|''|`)(row|listitem)(\\"|''|`)[^;]*(Mia|Keller|Deluxe Suite)|filter\(\s*\{\s*has(Text)?:[^;]*(Mia|Keller|Deluxe Suite))).*(frontend/e2e/TC-001-[\w.-]*\.spec\.ts|(?<![\w/])e2e/TC-001-[\w.-]*\.spec\.ts)'
---
