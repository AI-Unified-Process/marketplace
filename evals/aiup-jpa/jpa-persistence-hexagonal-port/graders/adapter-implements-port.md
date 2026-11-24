---
criterion: "Spring Data repository, converters, and adapter imitate RoomType"
type: regex
weight: 2
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*@Repository\b)(?=.*class GuestRepositoryImpl implements GuestRepository\b)(?=.*import com\.example\.hotel\.business\.guest\.GuestRepository;).*hotel-postgres/src/main/java/[^"]*/postgres/guest/GuestRepositoryImpl\.java'
---
