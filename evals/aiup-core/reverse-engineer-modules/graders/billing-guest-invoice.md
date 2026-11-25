---
criterion: "Cross-module relationships"
type: regex
weight: 1.5
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?docs/entity_model/bill[a-z-]*\.md.*(GUEST\s+[|}o{]{2}(--|\.\.)[|}o{]{2}\s+INVOICE\b|INVOICE\s+[|}o{]{2}(--|\.\.)[|}o{]{2}\s+GUEST\b)'
---
