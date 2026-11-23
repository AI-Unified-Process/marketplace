---
criterion: "Migration with the BR-001 marker"
type: regex
weight: 5
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?V003__[a-z0-9_]*plot_assignment[a-z0-9_]*\.sql.*-- UC-001 BR-001:[^\\]*\\n\s*(CONSTRAINT \w+ )?UNIQUE ?\(plot_id, ?season\)'
---
