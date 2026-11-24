---
criterion: "Standard test case format"
type: regex
weight: 2
target: trace
pattern: '"name":\s*"(?:Write|Edit|Bash)",\s*"input":\s*\{(?!\s*"file_path":\s*"[^"]*session-log\.md")(?![^\n]{0,120}session-log\.md)(?=[^\n]*?(?:docs/test_cases/TC-00[12]-[a-z0-9-]+\.md))(?=[^\n]*?(?:use_cases/UC-023-join-waiting-list\.md))(?![^\n]*?(?:use_cases/UC-022-lend-book\.md))(?=[^\n]*?(?:## Overview(?:(?!\\n## ).)*?(?:\*\*ID:\*\*\s*TC-00[12]\b)))(?=[^\n]*?(?:## Overview(?:(?!\\n## ).)*?(?:\*\*Goal:\*\*\s*\w)))(?=[^\n]*?(?:## Overview(?:(?!\\n## ).)*?(?:\*\*Priority:\*\*\s*(?:Critical|High|Medium|Low)\b)))(?=[^\n]*?(?:## Overview(?:(?!\\n## ).)*?(?:\*\*Status:\*\*\s*(?:Draft|Reviewed|Approved|Automated|Obsolete)\b)))'
---
