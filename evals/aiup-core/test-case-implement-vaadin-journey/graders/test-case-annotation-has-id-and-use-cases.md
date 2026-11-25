---
criterion: "@TestCase itinerary"
type: regex
weight: 2
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*@interface\s+TestCase\b)(?=.*\bid\(\))(?=.*\buseCases\(\)).*src/test/java/com/example/workshops/usecase/TestCase\.java'
---
