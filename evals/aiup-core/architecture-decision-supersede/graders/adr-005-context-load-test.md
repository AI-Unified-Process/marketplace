---
criterion: "New ADR content"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(?:Write|Edit|Bash)",\s*"input":\s*\{(?!\s*"file_path":\s*"[^"]*session-log\.md")(?![^\n]{0,120}session-log\.md)(?=[^\n]*?(?:decisions/ADR-005-[A-Za-z0-9-]+\.md))(?=[^\n]*?(?:## Context(?:(?!\\n## ).)*?(?:\b3\s*(?:to|-|\\u2013|\u2013)\s*4\s*s)))(?=[^\n]*?(?:## Context(?:(?!\\n## ).)*?(?:500[,.'' ]?000)))(?=[^\n]*?(?:## Context(?:(?!\\n## ).)*?(?:NFR-002)))'
---
