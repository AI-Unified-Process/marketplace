---
criterion: "Type mirrors the DTO field by field"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*src/[\w./-]*\.tsx?).*\b(image_url|imageURL|imageUri|productId|productName|title|cost|amount)\??:\s*(string|number)'
match: not_contains
---
