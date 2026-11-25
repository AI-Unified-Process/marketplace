---
criterion: "Specification is the oracle"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*register-guest/[\w.-]*\.spec\.ts).*(toContain|toBe|toEqual|toHaveTextContent|toMatch)\(\s*(\\"|''|`)Guest saved'
match: not_contains
---
