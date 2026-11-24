---
criterion: "Blazor component created"
type: regex
weight: 5
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*@page\s+\\\"/).*Features/UC010_BrowseProductCatalog/[\w.-]*\.razor(?![.\w])'
---
