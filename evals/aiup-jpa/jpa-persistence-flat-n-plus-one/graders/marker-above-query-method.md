---
criterion: "Business rule in the query with its marker"
type: regex
weight: 6
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?src/main/java/[^"]*Repository\.java.*// UC-031 BR-001:[^\\]*\\n\s*(@Query|@EntityGraph|default |List<|Page<|Slice<|Stream<)'
---
