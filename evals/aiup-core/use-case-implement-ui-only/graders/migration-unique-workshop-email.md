---
criterion: "Migration added, not edited"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?db/migration/V(?!1__)\d+(_\d+)*__[A-Za-z0-9_]*\.sql.*UNIQUE[^\\]*?\((\s*workshop_id\s*,\s*participant_email\s*|\s*participant_email\s*,\s*workshop_id\s*)\)'
---
