---
criterion: "Query and Handler enforce BR-010"
type: regex
weight: 5
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*(IDbContextFactory<AppDbContext>|AppDbContext\b))(?=.*\.Products\b).*Features/UC010_BrowseProductCatalog/[\w.-]*Handler\.cs'
---
