---
criterion: "Domain record without framework imports"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?hotel-domain/src/main/java/[^"]*/Guest\.java.*import (jakarta\.|org\.springframework|lombok)'
match: not_contains
---
