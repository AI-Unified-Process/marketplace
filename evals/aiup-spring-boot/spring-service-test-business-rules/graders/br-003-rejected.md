---
criterion: "BR-003 boundary cases"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?UC001RegisterGuestServiceTest\.java.*(isInstanceOf|isExactlyInstanceOf|assertThrows|assertThatExceptionOfType)\(\s*GuestTooYoungException\.class'
---
