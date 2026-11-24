---
criterion: "Separate entity in the adapter module"
type: regex
weight: 6
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*@Entity\b)(?=.*(public|protected) GuestEntity\(\s*\))(?=.*public \w+ get\w+\(\))(?=.*\\"guest_seq\\").*hotel-postgres/src/main/java/[^"]*/guest/model/GuestEntity\.java'
---
