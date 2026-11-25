---
criterion: "Keeps the legacy MockMvc convention"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?UC001RegisterGuestApiTest\.java.*(MockMvcTester|RestTestClient|RestAssured|WebTestClient)'
match: not_contains
---
