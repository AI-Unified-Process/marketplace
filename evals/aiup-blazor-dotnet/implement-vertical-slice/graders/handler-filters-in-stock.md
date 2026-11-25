---
criterion: "Query and Handler enforce BR-010"
type: regex
weight: 20
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*\.Where\(\s*\(?(\w+)\)?\s*=>\s*(\w+\.InStock\b(?!\s*==\s*false)|\w+\.InStock\s*==\s*true|[^)]*&&\s*\w+\.InStock\b)).*Features/UC010_BrowseProductCatalog/[\w.-]*Handler\.cs'
---
