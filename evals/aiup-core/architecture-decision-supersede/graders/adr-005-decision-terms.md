---
criterion: "New ADR content"
type: regex
weight: 5
target: trace
pattern: '"name":\s*"(?:Write|Edit|Bash)",\s*"input":\s*\{(?!\s*"file_path":\s*"[^"]*session-log\.md")(?![^\n]{0,120}session-log\.md)(?=[^\n]*?(?:decisions/ADR-005-[A-Za-z0-9-]+\.md))(?=[^\n]*?(?:## Decision(?:(?!\\n## ).)*?(?:tsvector)))(?=[^\n]*?(?:## Decision(?:(?!\\n## ).)*?(?:\bGIN\b)))(?=[^\n]*?(?:## Decision(?:(?!\\n## ).)*?(?:websearch_to_tsquery)))'
---
