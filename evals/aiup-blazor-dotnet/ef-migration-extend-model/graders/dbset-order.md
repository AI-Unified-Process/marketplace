---
criterion: "Fluent API via IEntityTypeConfiguration"
type: regex
weight: 2.5
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*DbSet<Order>).*AppDbContext\.cs'
---
