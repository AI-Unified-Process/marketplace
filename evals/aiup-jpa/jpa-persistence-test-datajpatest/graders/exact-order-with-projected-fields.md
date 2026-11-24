---
criterion: "Exact order and projected fields"
type: regex
weight: 5
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*containsExactly\()(?=.*(guestLastName|guestFirstName|roomTypeName|new ReservationListItem\()).*UC031SearchReservationsRepositoryTest\.java'
---
