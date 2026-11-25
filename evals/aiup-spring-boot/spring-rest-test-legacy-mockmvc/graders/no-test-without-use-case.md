---
criterion: "Class name and annotation reuse"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?UC001RegisterGuestApiTest\.java.*[{};](\\n|\s)*@Test((\\n|\s)+@(?!UseCase\b)\w+(\([^)]*\))?)*(\\n|\s)+(public\s+|protected\s+)?void\b'
match: not_contains
---
