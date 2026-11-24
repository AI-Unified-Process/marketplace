---
criterion: "API tests as the integration layer"
type: regex
weight: 4
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*is sold out)(?=.*already ordered a lunch for today)(?=.*not on today''s menu)(?=.*(409|CONFLICT))(?=.*(400|BAD_REQUEST)).*UC001OrderLunchApiTest\.java'
---
