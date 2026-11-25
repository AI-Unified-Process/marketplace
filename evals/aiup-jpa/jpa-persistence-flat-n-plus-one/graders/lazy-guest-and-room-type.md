---
criterion: "Lazy many-to-one associations"
type: regex
weight: 6
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*@ManyToOne\([^)]*FetchType\.LAZY[^)]*\)[^;]{0,200}?\bGuest \w+;)(?=.*@ManyToOne\([^)]*FetchType\.LAZY[^)]*\)[^;]{0,200}?\bRoomType \w+;).*/reservation/Reservation\.java'
---
