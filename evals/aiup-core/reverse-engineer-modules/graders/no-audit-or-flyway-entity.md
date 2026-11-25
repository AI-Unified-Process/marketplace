---
criterion: "No technical module"
type: regex
weight: 1
target: trace
pattern: '(?:"name":\s*"(?:Write|Edit)",\s*"input":\s*\{\s*"file_path":\s*"[^"]*?docs/entity_model[^"\s]*\.md|"name":\s*"Bash",\s*"input":\s*\{\s*"command":\s*"[^\n]*?(?:>|\btee\s+(?:-a\s+)?)\s*[^\s"]*?docs/entity_model[^"\s]*\.md).*###\s*(AUDIT_LOG|FLYWAY_SCHEMA_HISTORY|audit_log|flyway_schema_history)\b'
match: not_contains
---
