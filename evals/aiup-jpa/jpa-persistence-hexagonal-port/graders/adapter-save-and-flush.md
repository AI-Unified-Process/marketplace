---
criterion: "Spring Data repository, converters, and adapter imitate RoomType"
type: regex
weight: 2
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?hotel-postgres/src/main/java/[^"]*/GuestRepositoryImpl\.java.*\.saveAndFlush\('
---
