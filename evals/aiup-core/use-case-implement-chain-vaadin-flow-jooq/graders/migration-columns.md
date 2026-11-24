---
criterion: "Migration with the BR-001 marker"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*plot_assignment_seq)(?=.*REFERENCES plot)(?=.*REFERENCES gardener)(?=.*note\s+VARCHAR\(200\))(?=.*assigned_at\s+[A-Z ()0-9]*NOT NULL).*V003__[a-z0-9_]*plot_assignment[a-z0-9_]*\.sql'
---
