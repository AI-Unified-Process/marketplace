---
criterion: "Overview section"
type: regex
weight: 4
target: trace
pattern: '"name":\s*"(?:Write|Edit|Bash)",\s*"input":\s*\{(?!\s*"file_path":\s*"[^"]*session-log\.md")(?![^\n]{0,120}session-log\.md)(?=[^\n]*?(?:docs/test_cases/TC-001-[a-z0-9-]+\.md))(?=[^\n]*?(?:## Overview(?:(?!\\n## ).)*?(?:\*\*ID:\*\*\s*TC-001\b)))'
---
