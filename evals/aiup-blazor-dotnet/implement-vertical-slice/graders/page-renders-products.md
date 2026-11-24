---
criterion: "Blazor component created"
type: regex
weight: 7
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*(<table|<QuickGrid|<Grid\b|<ul|class=\\\"[^\\]*grid))(?=.*@foreach).*Features/UC010_BrowseProductCatalog/[\w.-]*\.razor(?![.\w])'
---
