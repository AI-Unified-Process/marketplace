---
criterion: "Blazor component created"
type: regex
weight: 8
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*(<select|<InputSelect))(?=.*[Cc]ategor).*Features/UC010_BrowseProductCatalog/[\w.-]*\.razor(?![.\w])'
---
