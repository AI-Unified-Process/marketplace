---
criterion: "Migration added, not edited"
type: regex
weight: 4
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*(CREATE|create) (TABLE|table)\s+(IF NOT EXISTS\s+)?registrations?\b)(?=.*(REFERENCES|references)\s+workshops?\b)(?=.*participant_name)(?=.*participant_email)(?=.*registered_at)[^\n]*?db/migration/V(?!1__)\d+(_\d+)*__[A-Za-z0-9_]*\.sql'
---
