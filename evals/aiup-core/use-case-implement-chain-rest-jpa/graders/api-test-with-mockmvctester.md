---
criterion: "API tests as the integration layer"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*MockMvcTester)(?=.*@SpringBootTest).*UC001OrderLunchApiTest\.java'
---
