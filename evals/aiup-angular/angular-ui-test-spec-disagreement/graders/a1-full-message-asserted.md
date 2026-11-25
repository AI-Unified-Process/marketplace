---
criterion: "A1 asserts the full message"
type: regex
weight: 4
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*\.(toContain|toBe|toEqual|toHaveTextContent|toMatch)\(\s*(\\"|''|`)This email address is already registered\.(\\"|''|`)).*register-guest/[\w.-]*\.spec\.ts'
---
