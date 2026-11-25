---
criterion: "Layers below implemented"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*(CREATE|create) (TABLE|table)\s+(IF NOT EXISTS\s+)?registrations?\b)(?=.*(REFERENCES|references)\s+workshops?\b)[^\n]*?db/migration/V(?!1__)\d+(_\d+)*__[A-Za-z0-9_]*\.sql'
---
