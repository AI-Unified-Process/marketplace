---
criterion: "Product EF Core entity created"
type: regex
weight: 4
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*DbSet<Product>).*AppDbContext\.cs'
---
