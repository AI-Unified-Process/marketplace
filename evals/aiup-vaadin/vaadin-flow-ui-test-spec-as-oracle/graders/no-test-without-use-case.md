---
criterion: "@UseCase on every test method"
type: regex
weight: 2
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?UC020RegisterGuestTest\.java.*[{};](\\n|\s)*@Test((\\n|\s)+@(?!UseCase\b)\w+(\([^)]*\))?)*(\\n|\s)+(public\s+|protected\s+)?void\b'
match: not_contains
---
