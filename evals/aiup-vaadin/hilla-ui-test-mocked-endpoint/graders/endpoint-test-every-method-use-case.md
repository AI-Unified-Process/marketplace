---
criterion: "Endpoint contract test class"
type: regex
weight: 1
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?UC020RegisterGuestEndpointTest\.java.*[{};](\\n|\s)*@Test((\\n|\s)+@(?!UseCase\b)\w+(\([^)]*\))?)*(\\n|\s)+(public\s+|protected\s+)?void\b'
match: not_contains
---
