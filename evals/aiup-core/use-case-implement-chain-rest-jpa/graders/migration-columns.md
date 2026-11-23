---
criterion: "Migration with the BR-002 marker"
type: regex
weight: 2
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*lunch_order_seq)(?=.*REFERENCES dish)(?=.*employee_number\s+VARCHAR\(6\))(?=.*DECIMAL\(6, ?2\))(?=.*ordered_at\s+[A-Z ()0-9]*NOT NULL).*V002__[a-z0-9_]*lunch_order[a-z0-9_]*\.sql'
---
