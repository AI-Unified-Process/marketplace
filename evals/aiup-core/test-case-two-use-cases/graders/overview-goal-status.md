---
criterion: "Overview section"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(?:Write|Edit|Bash)",\s*"input":\s*\{(?!\s*"file_path":\s*"[^"]*session-log\.md")(?![^\n]{0,120}session-log\.md)(?=[^\n]*?(?:docs/test_cases/TC-001-[a-z0-9-]+\.md))(?=[^\n]*?(?:## Overview(?:(?!\\n## ).)*?(?:\*\*Goal:\*\*\s*\w)))(?=[^\n]*?(?:## Overview(?:(?!\\n## ).)*?(?:\*\*Status:\*\*\s*(?:Draft|Reviewed|Approved|Automated|Obsolete)\b)))'
---
