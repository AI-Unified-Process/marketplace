---
criterion: "Customer-Order relationship mapped"
type: regex
weight: 6
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*(HasOne\([^)]*\.Customer\)[^;]*?\.WithMany|HasMany\([^)]*\.Orders\)[^;]*?\.WithOne)[^;]*?\.HasForeignKey\().*Data/[\w./-]*\.cs'
---
