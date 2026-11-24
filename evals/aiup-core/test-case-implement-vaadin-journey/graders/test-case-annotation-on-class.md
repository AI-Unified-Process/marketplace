---
criterion: "@TestCase itinerary"
type: regex
weight: 5
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*@TestCase\(\s*id\s*=\s*\\"TC-001\\"\s*,\s*useCases\s*=\s*\{\s*\\"UC-001\\"\s*,\s*\\"UC-002\\"\s*,\s*\\"UC-003\\"\s*\}\s*\)).*TC001\w*IT\.java'
---
