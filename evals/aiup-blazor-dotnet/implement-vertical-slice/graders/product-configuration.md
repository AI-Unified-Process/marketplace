---
criterion: "Product EF Core entity created"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*(IEntityTypeConfiguration<Product>|\.Entity<Product>\()).*[\w./-]*\.cs'
---
