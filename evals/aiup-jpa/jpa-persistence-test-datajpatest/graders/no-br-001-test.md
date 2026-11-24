---
criterion: "BR-001 left to the integration layer"
type: regex
weight: 5
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?UC031SearchReservationsRepositoryTest\.java.*(businessRules = \{[^}]*\\"BR-001\\"|void \w*[Cc]ancel\w*\()'
match: not_contains
---
