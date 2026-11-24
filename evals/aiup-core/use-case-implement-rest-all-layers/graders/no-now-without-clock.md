---
criterion: "Service enforces the rules"
type: regex
weight: 1
target: trace
pattern: '(?:"name":\s*"(?:Write|Edit)",\s*"input":\s*\{\s*"file_path":\s*"[^"]*?src/main/java/[^"\s]*\.java|"name":\s*"Bash",\s*"input":\s*\{\s*"command":\s*"[^\n]*?(?:>|\btee\s+(?:-a\s+)?)\s*[^\s"]*?src/main/java/[^"\s]*\.java).*(LocalDateTime|LocalDate|Instant|OffsetDateTime|ZonedDateTime)\.now\(\)'
match: not_contains
---
