---
criterion: "API tests as the integration layer"
type: regex
weight: 1
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?UC001OrderLunchApiTest\.java.*scenario = \\"A1: Dish Sold Out\\"'
---
