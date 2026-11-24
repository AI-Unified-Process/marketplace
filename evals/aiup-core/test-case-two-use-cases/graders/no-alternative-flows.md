---
criterion: "No per-use-case detail re-tested"
type: regex
weight: 7
target: trace
pattern: '"name":\s*"(?:Write|Edit|Bash)",\s*"input":\s*\{(?!\s*"file_path":\s*"[^"]*session-log\.md")(?![^\n]{0,120}session-log\.md)(?=[^\n]*?(?:docs/test_cases/TC-001-[a-z0-9-]+\.md))(?=[^\n]*?(?:must not be empty|already exists|[Dd]uplicate e-?mail|[Cc]ourse is full|already enrolled|no free capacity))'
match: not_contains
---
